/**
 * Formats a phone string for user display.
 * Keeps digits and an optional leading +.
 * Returns empty string if raw is empty or has fewer than 8 digits.
 */
export function formatPhoneDisplay(raw: string | undefined | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 8) return "";

  // India (+91) format: +91 XXXXX XXXXX
  if (hasPlus && digits.startsWith("91") && digits.length === 12) {
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7, 12);
    return `+91 ${part1} ${part2}`;
  }

  // Without plus, but 12 digits starting with 91
  if (!hasPlus && digits.startsWith("91") && digits.length === 12) {
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7, 12);
    return `+91 ${part1} ${part2}`;
  }

  // 10-digit number (common in India or US)
  if (digits.length === 10) {
    if (hasPlus) {
      return `+${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Generic formatting in blocks of 3-4 digits
  if (hasPlus) {
    const chunks: string[] = [];
    let rem = digits;
    if (rem.length > 10) {
      const ccLen = rem.length - 10;
      chunks.push(`+${rem.slice(0, ccLen)}`);
      rem = rem.slice(ccLen);
    } else {
      chunks.push(`+${rem.slice(0, 1)}`);
      rem = rem.slice(1);
    }
    while (rem.length > 4) {
      const take = rem.length > 7 ? 3 : 4;
      chunks.push(rem.slice(0, take));
      rem = rem.slice(take);
    }
    if (rem.length > 0) chunks.push(rem);
    return chunks.join(" ");
  }

  // Generic digits without plus
  const chunks: string[] = [];
  let rem = digits;
  while (rem.length > 4) {
    const take = rem.length % 3 === 0 ? 3 : rem.length % 2 === 0 ? 4 : 3;
    chunks.push(rem.slice(0, take));
    rem = rem.slice(take);
  }
  if (rem.length > 0) chunks.push(rem);
  return chunks.join(" ");
}

/**
 * Returns tel: URI with leading + (if present) and digits only.
 * Returns empty string if raw is empty or has fewer than 8 digits.
 */
export function phoneHref(raw: string | undefined | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 8) return "";

  return `tel:${hasPlus ? "+" : ""}${digits}`;
}

