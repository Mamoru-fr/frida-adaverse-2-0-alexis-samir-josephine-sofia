type Props = {
    message: string;
    onClose?: () => void;
}

export function ErrorMessage({message, onClose}: Props) {
    return (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-300 p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                    <p className="mt-1 text-sm text-red-700">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-3 text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label="Fermer"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}