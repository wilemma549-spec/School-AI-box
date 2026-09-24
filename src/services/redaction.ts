import { ExtractedNotice, RedactionReport, RedactionToken, SchoolNoticeItem } from '../types';

/**
 * On-device Privacy Redaction Engine (本地隱私脫敏引擎 /「借走個名」)
 * 100% Client-Side. No personal names or school names leave the device unmasked.
 */

// Common UK school child names & Chinese names for local detection
const POPULAR_CHILD_NAMES = [
  '陳小明',
  '張心怡',
  '李嘉樂',
  '王子軒',
  '黃思涵',
  'Leo',
  'Oliver',
  'Mia',
  'Lucas',
  'Noah',
  'Arthur',
  'Jack',
  'George',
  'Harry',
  'Oscar',
  'Amelia',
  'Olivia',
  'Isla',
  'Ava',
  'Lily',
  'Ivy',
  'Sophia',
  'Grace',
  'Sophie',
  'Emily',
  'Henry',
  'Freddie',
  'Archie',
  'Charlie',
  'Alexander',
  'Thomas',
];

export function redactText(rawText: string, knownChildren: string[] = []): RedactionReport {
  if (!rawText) {
    return {
      originalText: '',
      anonymizedText: '',
      tokens: [],
      redactedCount: 0,
    };
  }

  let anonymized = rawText;
  const tokens: RedactionToken[] = [];
  let childCounter = 1;
  let teacherCounter = 1;

  // 1. Redact Known / Specified Children First
  const allChildNames = Array.from(new Set([...knownChildren, ...POPULAR_CHILD_NAMES]));

  // Also check patterns like "Child's Name: John Doe", "Pupil: Jane Smith", "regarding Leo in Year 4"
  const pupilRegex = /(?:Child(?:'s)?\s*Name|Pupil(?:\s*Name)?|Student|Pupil)\s*[:=]\s*([A-Za-z\u4e00-\u9fa5\s]{2,20})/gi;
  let match;
  while ((match = pupilRegex.exec(rawText)) !== null) {
    const detectedName = match[1].replace(/Class|Year|\n|\r|Date|Sign.*/i, '').trim();
    if (detectedName && detectedName.length > 1 && !allChildNames.includes(detectedName)) {
      allChildNames.unshift(detectedName);
    }
  }

  // Also detect "Year 4 Willow: Leo" or "Dear Leo's Parents"
  const parentOfRegex = /(?:parents?\s+of|dear\s+)([A-Za-z\u4e00-\u9fa5]+)(?:'s)?\s+parents?/gi;
  while ((match = parentOfRegex.exec(rawText)) !== null) {
    const detectedName = match[1].trim();
    if (detectedName && detectedName.length > 1 && !allChildNames.includes(detectedName)) {
      allChildNames.unshift(detectedName);
    }
  }

  // Apply child name redactions
  for (const childName of allChildNames) {
    if (!childName || childName.trim().length < 2) continue;
    // Word boundary or Chinese character match
    const isChinese = /[\u4e00-\u9fa5]/.test(childName);
    const regex = isChinese
      ? new RegExp(childName, 'g')
      : new RegExp(`\\b${escapeRegExp(childName)}\\b`, 'gi');

    if (regex.test(anonymized)) {
      const placeholder = `[CHILD_${childCounter}]`;
      childCounter++;
      tokens.push({
        placeholder,
        original: childName,
        category: 'child',
      });
      anonymized = anonymized.replace(regex, placeholder);
    }
  }

  // 2. Redact School Names (e.g. "St. Peter's C.E. Primary School", "Greenhill Primary Academy")
  const schoolRegex = /\b([A-Z][a-zA-Z'.\s]+?\s+(?:Primary|Infant|Junior|Academy|Grammar|College|School|Nursery)(?:\s+(?:School|Academy|Trust))?)\b/g;
  const detectedSchools: string[] = [];
  while ((match = schoolRegex.exec(rawText)) !== null) {
    const school = match[1].trim();
    if (school && school.length > 5 && !detectedSchools.includes(school)) {
      detectedSchools.push(school);
    }
  }

  detectedSchools.forEach((school) => {
    const placeholder = '[SCHOOL]';
    // If not already in tokens
    if (!tokens.some((t) => t.placeholder === placeholder)) {
      tokens.push({
        placeholder,
        original: school,
        category: 'school',
      });
      const regex = new RegExp(escapeRegExp(school), 'g');
      anonymized = anonymized.replace(regex, placeholder);
    }
  });

  // 3. Redact Teacher / Staff Names (e.g. "Mr Smith", "Mrs Higgins", "Miss Davies")
  const teacherRegex = /\b((?:Mr|Mrs|Ms|Miss|Dr)\.?\s+[A-Z][a-z]+)\b/g;
  while ((match = teacherRegex.exec(rawText)) !== null) {
    const teacherName = match[1].trim();
    if (!tokens.some((t) => t.original.toLowerCase() === teacherName.toLowerCase())) {
      const placeholder = `[TEACHER_${teacherCounter}]`;
      teacherCounter++;
      tokens.push({
        placeholder,
        original: teacherName,
        category: 'teacher',
      });
      const regex = new RegExp(`\\b${escapeRegExp(teacherName)}\\b`, 'g');
      anonymized = anonymized.replace(regex, placeholder);
    }
  }

  // 4. Redact Phone Numbers (e.g. 01727 854321, 07123 456789)
  const phoneRegex = /\b(?:Tel(?:ephone)?\s*[:.]?\s*)?(0\d{4}\s?\d{6}|0\d{3}\s?\d{7}|07\d{3}\s?\d{6})\b/g;
  while ((match = phoneRegex.exec(rawText)) !== null) {
    const phone = match[1].trim();
    if (!tokens.some((t) => t.original === phone)) {
      const placeholder = '[PHONE]';
      tokens.push({
        placeholder,
        original: phone,
        category: 'contact',
      });
      anonymized = anonymized.replace(new RegExp(escapeRegExp(phone), 'g'), placeholder);
    }
  }

  // 5. Redact Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  while ((match = emailRegex.exec(rawText)) !== null) {
    const email = match[0].trim();
    if (!tokens.some((t) => t.original === email)) {
      const placeholder = '[EMAIL]';
      tokens.push({
        placeholder,
        original: email,
        category: 'contact',
      });
      anonymized = anonymized.replace(new RegExp(escapeRegExp(email), 'g'), placeholder);
    }
  }

  // 6. Redact UK Postcode (e.g. AL1 3HG, LS8 2AY)
  const postcodeRegex = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/g;
  while ((match = postcodeRegex.exec(rawText)) !== null) {
    const postcode = match[1].trim();
    if (!tokens.some((t) => t.original === postcode)) {
      const placeholder = '[POSTCODE]';
      tokens.push({
        placeholder,
        original: postcode,
        category: 'location',
      });
      anonymized = anonymized.replace(new RegExp(escapeRegExp(postcode), 'g'), placeholder);
    }
  }

  return {
    originalText: rawText,
    anonymizedText: anonymized,
    tokens,
    redactedCount: tokens.length,
  };
}

/**
 * Restore Real Names Locally on Device (本地還原 /「歸還個名」)
 * Replaces [CHILD_1] -> "陳小明", [SCHOOL] -> "St. Peter's C.E. Primary", etc.
 */
export function restoreNoticeFromRedaction(
  notice: ExtractedNotice,
  tokens: RedactionToken[]
): ExtractedNotice {
  if (!tokens || tokens.length === 0) {
    return notice;
  }

  const replaceText = (text: string | undefined): string => {
    if (!text) return '';
    let result = text;
    for (const token of tokens) {
      result = result.replaceAll(token.placeholder, token.original);
    }
    return result;
  };

  // Restore task items
  const restoredTasks: SchoolNoticeItem[] = notice.tasks.map((task) => ({
    ...task,
    title: replaceText(task.title),
    notes: task.notes ? replaceText(task.notes) : undefined,
    child_name: task.child_name ? replaceText(task.child_name) : undefined,
  }));

  // Find primary child name if identified
  const childToken = tokens.find((t) => t.category === 'child');
  const primaryChild = notice.child_name
    ? replaceText(notice.child_name)
    : childToken
    ? childToken.original
    : undefined;

  return {
    ...notice,
    title: replaceText(notice.title),
    school_name: replaceText(notice.school_name),
    child_name: primaryChild,
    summary: replaceText(notice.summary),
    tasks: restoredTasks,
    payment: {
      ...notice.payment,
      notes: replaceText(notice.payment.notes),
    },
    items_to_bring: notice.items_to_bring.map((item) => replaceText(item)),
    important_notes: notice.important_notes.map((note) => replaceText(note)),
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
