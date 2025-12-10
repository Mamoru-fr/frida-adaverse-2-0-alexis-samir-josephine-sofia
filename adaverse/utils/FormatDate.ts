export function FormatDate(date: string) {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
}