'use client';

import React, {useState} from 'react';

type CreateCommentProps = {
    projectId: number,
    refreshComments: () => void,
}

export function CreateComment({projectId, refreshComments}: CreateCommentProps) {
    const [content, setContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() !== '' && !isSubmitting) {
            setIsSubmitting(true);
            try {
                const response = await fetch(`/api/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({projectId, content})
                });
                
                if (response.ok) {
                    setContent('');
                    refreshComments();
                } else {
                    const error = await response.json();
                    console.error('Error creating comment:', error);
                    alert(error.error || 'Failed to post comment');
                }
            } catch (error) {
                console.error('Error creating comment:', error);
                alert('Failed to post comment');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className="mb-6 bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md">
            <h4 className="text-xl font-bold mb-3 text-white">
                Ajouter un commentaire
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre commentaire..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-colors resize-none"
                    required
                    disabled={isSubmitting}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Publication...' : 'Publier'}
                    </button>
                </div>
            </form>
        </div>
    );
}