export function formatRupiah(
  value: string | number | null | undefined,
): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "";
  }

  return new Intl.NumberFormat(
    "id-ID",
  ).format(number);
}

export function parseRupiah(
  value: string,
): number {
  const cleaned = value.replace(
    /\D/g,
    "",
  );

  return Number(cleaned || 0);
}