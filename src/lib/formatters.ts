/**
 * Shared formatting utilities used across timeline node components.
 * All formatters are pure functions — no side effects.
 */

/** Format a monetary value using Intl. Defaults to Turkish Lira. */
export function formatCurrency(
  amount: number,
  currency = "TRY",
  locale = "tr-TR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO datetime string for display in Turkey locale. */
export function formatDate(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", options).format(
      new Date(isoString)
    );
  } catch {
    return isoString;
  }
}

/** Format a date only (no time). */
export function formatDateOnly(isoString: string): string {
  return formatDate(isoString, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format bytes to a human-readable file size. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

/** Format a distance in km. */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/** Returns initials for an avatar (e.g. "Selin Çelik" → "SÇ"). */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase() ?? "")
    .join("");
}

/** Relative time label for a deadline (e.g. "2 gün kaldı"). */
export function formatDeadlineRelative(isoString: string): string {
  const ms = new Date(isoString).getTime() - Date.now();
  const hours = ms / 3_600_000;
  if (hours < 0) return "Süre doldu";
  if (hours < 1) return `${Math.floor(hours * 60)} dakika kaldı`;
  if (hours < 24) return `${Math.floor(hours)} saat kaldı`;
  return `${Math.floor(hours / 24)} gün kaldı`;
}
