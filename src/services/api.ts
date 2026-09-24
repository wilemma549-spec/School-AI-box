import { ExtractedNotice, SchoolNoticeItem, OcrResult, RedactionReport } from '../types';
import { redactText, restoreNoticeFromRedaction } from './redaction';

export interface ParseRequest {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
  ocrResult?: OcrResult;
  isDocumentPhoto?: boolean;
  knownChildren?: string[];
  enableRedaction?: boolean;
}

export const scanDocumentOcr = async (
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<OcrResult> => {
  const response = await fetch('/api/ocr-scan-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to OCR document (${response.status})`);
  }

  const data = await response.json();
  return {
    raw_text: data.raw_text || '',
    word_count: data.word_count || (data.raw_text ? data.raw_text.split(/\s+/).length : 0),
    confidence: data.confidence || 96,
    detected_lines: data.detected_lines || [],
    document_type: data.document_type || 'paper_letter',
  };
};

export const parseSchoolNotice = async (req: ParseRequest): Promise<ExtractedNotice> => {
  // Step 2 in prompt: On-device Redaction ("本地處理同『借走個名』")
  // Run 100% on device before anything is sent over the network
  const shouldRedact = req.enableRedaction !== false;
  let textToSend = req.text || '';
  let redactionReport: RedactionReport | undefined = undefined;

  if (shouldRedact && textToSend) {
    redactionReport = redactText(textToSend, req.knownChildren);
    textToSend = redactionReport.anonymizedText;
  }

  // If text is provided, avoid sending raw image to AI API to preserve complete on-device privacy
  const imageToSend = textToSend ? undefined : req.imageBase64;
  const mimeTypeToSend = textToSend ? undefined : req.mimeType;

  const response = await fetch('/api/parse-school-notice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: textToSend,
      imageBase64: imageToSend,
      mimeType: mimeTypeToSend,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server failed to parse notice (${response.status})`);
  }

  const data = await response.json();

  const tasksWithState: SchoolNoticeItem[] = (data.tasks || []).map((t: any, index: number) => ({
    id: `task-${Date.now()}-${index}`,
    title: t.title || 'Untitled Action Item',
    child_name: t.child_name || data.child_name || '',
    due_date: t.due_date || null,
    category: t.category || 'other',
    priority: t.priority === 'high' ? 'high' : 'normal',
    notes: t.notes || '',
    selected: true,
    synced: false,
  }));

  const ocrResult: OcrResult | undefined = req.ocrResult || (data.ocr_raw_text ? {
    raw_text: data.ocr_raw_text,
    word_count: data.ocr_raw_text.split(/\s+/).length,
    confidence: 97,
    detected_lines: (data.tasks || []).map((t: any) => t.title).slice(0, 4),
    document_type: req.isDocumentPhoto ? 'paper_letter' : 'screen_capture',
  } : undefined);

  const rawExtracted: ExtractedNotice = {
    id: `notice-${Date.now()}`,
    title: data.title || 'School Notice',
    school_name: data.school_name || 'School',
    child_name: data.child_name || '',
    summary: data.summary || '',
    due_date: data.due_date || '',
    event_date: data.event_date || '',
    tasks: tasksWithState,
    payment: data.payment || {
      required: false,
      amount: '',
      method: '',
      due_date: '',
      notes: '',
    },
    items_to_bring: data.items_to_bring || [],
    dates_to_note: data.dates_to_note || [],
    important_notes: data.important_notes || [],
    raw_text: req.text || data.ocr_raw_text || (req.imageBase64 ? '[Document Photo Scanned]' : ''),
    image_preview: req.imageBase64,
    ocr_result: ocrResult,
    is_document_photo: req.isDocumentPhoto,
    redaction_report: redactionReport,
    created_at: new Date().toISOString(),
  };

  // Step 3 in prompt: On-device restoration ("收到結果後，喺手機本地將個名還原")
  if (redactionReport && redactionReport.tokens.length > 0) {
    const restored = restoreNoticeFromRedaction(rawExtracted, redactionReport.tokens);
    restored.redaction_report = redactionReport;
    return restored;
  }

  return rawExtracted;
};

