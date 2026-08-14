const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const HTML_TAG_PATTERN = /<[^>]*>/g;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function cleanWhitespace(value: string) {
  return value.replace(CONTROL_CHARS_PATTERN, "").replace(/\s+/g, " ").trim();
}

export function sanitizeText(value: string): string {
  return cleanWhitespace(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(HTML_TAG_PATTERN, " ")
      .replace(URL_PATTERN, " ")
  );
}

export function sanitizeMultilineText(value: string): string {
  return value
    .replace(CONTROL_CHARS_PATTERN, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(HTML_TAG_PATTERN, " ")
    .replace(URL_PATTERN, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeEmail(value: string): string {
  return cleanWhitespace(value).toLowerCase();
}

export function sanitizePhone(value: string): string {
  return value.replace(CONTROL_CHARS_PATTERN, "").replace(/[^\d+()\-\s]/g, "").trim();
}

