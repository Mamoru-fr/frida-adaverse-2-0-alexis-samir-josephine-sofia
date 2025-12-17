'use client';

import {Comments} from '@/content/interface';
import React, {useState} from 'react';

type ModifyCommentProps = {
    comment: Comments;
    onSave: (content: string) => void;
    onCancel: () => void;
    onDelete: () => void;
}

export function ModifyComment({comment, onSave, onCancel, onDelete}: ModifyCommentProps) {
    const [content, setContent] = useState<string>(comment.content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() !== '') {
            onSave(content);
        }
    }

    return (
        <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md">
            <h4 className="text-xl font-bold mb-3 text-white">
                Modifier le commentaire
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre commentaire..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-colors resize-none"
                    required
                />
                <div className="flex justify-between gap-2">
                    <button
                        type="button"
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                        🗑️ Supprimer
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2 rounded-xl transition-colors"
                        >
                            Mettre à jour
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}