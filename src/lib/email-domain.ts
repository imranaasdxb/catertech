const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "20minutemail.com",
  "anonaddy.com",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "fakemail.net",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "maildrop.cc",
  "mailinator.com",
  "mintemail.com",
  "moakt.com",
  "mytemp.email",
  "sharklasers.com",
  "spamgourmet.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const DISPOSABLE_DOMAIN_PATTERNS = [
  /(^|\.)10minutemail\./,
  /(^|\.)guerrillamail\./,
  /(^|\.)mailinator\./,
  /(^|\.)tempmail\./,
  /(^|\.)yopmail\./,
];

export function getEmailDomain(email: string) {
  const [, domain = ""] = email.trim().toLowerCase().split("@");
  return domain;
}

export function isDisposableEmail(email: string) {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return (
    DISPOSABLE_EMAIL_DOMAINS.has(domain) ||
    DISPOSABLE_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain))
  );
}
