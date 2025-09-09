export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const DOCUMENT_TYPES = [
  'W-2',
  '1099',
  '1040',
  'Schedule A',
  'Schedule B',
  'Schedule C',
  'Other',
] as const;

export const SAMPLE_QUESTIONS = [
  "How much did I make last year vs this year?",
  "What's my total income from all sources?",
  "Show me my tax deductions",
  "Compare my W-2 income between years",
  "What are my business expenses?",
] as const;
