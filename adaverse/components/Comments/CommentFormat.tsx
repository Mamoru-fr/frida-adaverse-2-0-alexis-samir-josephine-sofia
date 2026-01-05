interface CommentType {
    id: number;
    content: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface CommentProps {
    comment: CommentType;
    onEdit: () => void;
    onDelete?: () => void;
    session: any;
}

export function CommentFormat({comment, onEdit, onDelete: onDeleteCallback, session}: CommentProps) {
    const canEdit = session?.user?.id === comment.user?.id;
    const isAdmin = session?.user?.role === 'admin';
    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (onDeleteCallback) {
                    onDeleteCallback();
                } else {
                    window.location.reload();
                }
            } else {
                console.error('Failed to delete comment');
                alert('Erreur lors de la suppression du commentaire');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Erreur lors de la suppression du commentaire');
        }
    };

    return (
        <div className="bg-gray-500/90 backdrop-blur-sm shadow-md hover:bg-gray-500 transition-all rounded-xl p-5">
            <div className="flex flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    {comment.user && (
                        <div className="flex items-center gap-2 mb-2">
                            {comment.user.image ? (
                                <img
                                    src={comment.user.image}
                                    alt={comment.user.name}
                                    className="w-6 h-6 rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-xs font-semibold text-white">
                                    {comment.user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-semibold text-sm text-white">
                                {comment.user.name}
                            </span>
                        </div>
                    )}
                    <p className="text-gray-200 leading-relaxed mb-2">
                        {comment.content}
                    </p>
                    <div className="flex flex-row justify-between items-center">
                        <small className="text-gray-300 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </small>
                        <div className="flex gap-2">
                            {canEdit && (
                                <button
                                    onClick={onEdit}
                                    className="px-3 py-1 rounded-xl bg-amber-700 hover:bg-amber-800 transition-colors text-sm text-white font-medium"
                                >
                                    ✏️ Modifier
                                </button>
                            )}
                            {(isAdmin && !canEdit) && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 transition-colors text-sm text-white font-medium"
                                >
                                    🗑️ Supprimer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
