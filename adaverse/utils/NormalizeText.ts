/**
 * Normalize text by removing accents and converting to lowercase
 * This allows accent-insensitive search
 * Example: "Théâtre" becomes "theatre"
 */
export function NormalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD') // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
        .trim();
}
