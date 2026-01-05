export function FormatDate(date: string | Date) : string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
}

export function FormatDatePlainText(date: string | Date) : string {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).format(new Date(date));
}