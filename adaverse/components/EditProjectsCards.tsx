"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface EditProps {
    closeEdit: () => void;
    projectId: number;
    onDelete: () => void;
}

export function EditProjectsCards({ closeEdit, projectId, onDelete }: EditProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Êtes-vous sûr de vouloir supprimer ce projet ?"
        );

        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/project_students?id=${projectId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Projet supprimé avec succès :", data);
                onDelete();
                closeEdit();
            } else {
                console.error("Erreur lors de la suppression :", data);
                alert(`Erreur : ${data.error}`);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Erreur lors de la suppression du projet");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="absolute text-black w-full h-full bg-[#ffffffab] backdrop-blur-sm p-4 flex flex-col items-center justify-center gap-4 top-0 left-0 shadow-lg z-20 rounded-lg">
            
            <button 
                className="absolute right-3 top-2 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-200 font-bold text-lg"
                onClick={closeEdit}
            >
                ✕
            </button>
            
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
                
                <button 
                    className="cursor-pointer bg-amber-700 hover:bg-amber-600 text-white p-3 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                    onClick={() => {
                        alert("Fonctionnalité de modification à venir");
                    }}
                >
                    <Pencil className="w-5 h-5" />
                    <span>Modifier</span>
                </button>
                
                <button 
                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>Suppression...</span>
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-5 h-5" />
                            <span>Supprimer</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}