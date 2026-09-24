export type TaskCategory = 'paperwork' | 'payment' | 'preparation' | 'event' | 'attendance' | 'other';
export type TaskPriority = 'high' | 'normal';

export interface RedactionToken {
  placeholder: string; // e.g. '[CHILD_1]', '[SCHOOL]', '[TEACHER_1]'
  original: string; // e.g. '陳小明', "St. Peter's C.E. Primary", 'Mr Smith'
  category: 'child' | 'school' | 'teacher' | 'contact' | 'location';
}

export interface RedactionReport {
  originalText: string;
  anonymizedText: string;
  tokens: RedactionToken[];
  redactedCount: number;
}

export interface SchoolNoticeItem {
  id: string;
  title: string;
  child_name?: string;
  due_date: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  notes?: string;
  selected: boolean;
  synced?: boolean;
  googleTaskId?: string;
}

export interface SchoolPayment {
  required: boolean;
  amount: string;
  method: string;
  due_date: string;
  notes: string;
}

export interface OcrResult {
  raw_text: string;
  word_count: number;
  confidence: number;
  detected_lines?: string[];
  document_type?: 'paper_letter' | 'screen_capture' | 'typed_notice' | 'newsletter';
}

export interface ExtractedNotice {
  id: string;
  title: string;
  school_name: string;
  child_name?: string;
  summary: string;
  due_date?: string;
  event_date?: string;
  tasks: SchoolNoticeItem[];
  payment: SchoolPayment;
  items_to_bring: string[];
  dates_to_note: Array<{ label: string; date: string }>;
  important_notes: string[];
  raw_text: string;
  image_preview?: string;
  ocr_result?: OcrResult;
  is_document_photo?: boolean;
  redaction_report?: RedactionReport;
  created_at: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

export interface GoogleTaskResponse {
  id: string;
  title: string;
  status: string;
  due?: string;
  notes?: string;
  webViewLink?: string;
}

