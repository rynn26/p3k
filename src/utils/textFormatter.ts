/**
 * Formatter pintar: 2 atau 3 huruf kapital semua (IGD, ICU, HCU, PT, K3, dll),
 * kata > 3 huruf kapital awal kata (Title Case).
 * Sama persis dengan formatSmartTitle di Flutter admin_management_screen.dart
 */
export function formatSmartTitle(text: string): string {
  if (!text) return text;
  const words = text.split(' ');
  const formattedWords = words.map((word) => {
    if (!word) return '';
    const clean = word.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length >= 2 && clean.length <= 3) {
      return word.toUpperCase();
    } else if (clean.length > 3) {
      const firstIdx = word.search(/[a-zA-Z0-9]/);
      if (firstIdx === -1) return word;
      const prefix = word.substring(0, firstIdx);
      const rest = word.substring(firstIdx);
      return prefix + rest[0].toUpperCase() + rest.substring(1).toLowerCase();
    } else if (clean.length === 1) {
      return word.toUpperCase();
    }
    return word;
  });
  return formattedWords.join(' ');
}
