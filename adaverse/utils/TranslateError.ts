export function translateError(errorMessage: string): string {
    const translations: Record<string, string> = {
        // Better Auth common errors
        "Invalid email or password": "Email ou mot de passe incorrect",
        "Invalid credentials": "Identifiants invalides",
        "User not found": "Utilisateur non trouvé",
        "User already exists": "Cet utilisateur existe déjà",
        "Email already exists": "Cet email est déjà utilisé",
        "Invalid email": "Email invalide",
        "Invalid password": "Mot de passe invalide",
        "Password too short": "Mot de passe trop court, minimum 8 caractères",
        "Password too weak": "Mot de passe trop faible",
        "Unauthorized": "Non autorisé",
        "Session expired": "Session expirée",
        "Account locked": "Compte verrouillé",
        "Too many requests": "Trop de tentatives",
        "You have been banned from this application. Please contact support if you believe this is an error.": "Vous avez été banni de cette application. Veuillez contacter le support si vous pensez qu'il s'agit d'une erreur.",
        // Add more translations as needed
    };

    // Check for exact match
    if (translations[errorMessage]) {
        return translations[errorMessage];
    }

    // Check for partial matches (case insensitive)
    const lowerMessage = errorMessage.toLowerCase();
    for (const [key, value] of Object.entries(translations)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return value;
        }
    }

    // Return original message if no translation found
    return errorMessage;
}
