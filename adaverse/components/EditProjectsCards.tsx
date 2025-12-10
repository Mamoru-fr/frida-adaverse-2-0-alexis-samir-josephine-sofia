"use client";

import { useState } from "react";

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
                    <svg 
                        stroke="currentColor" 
                        fill="currentColor" 
                        strokeWidth="0" 
                        viewBox="0 0 16 16" 
                        height="1.2em" 
                        width="1.2em" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"></path>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z" clipRule="evenodd"></path>
                    </svg>
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
                            <svg 
                                stroke="currentColor" 
                                fill="currentColor" 
                                strokeWidth="0" 
                                viewBox="0 0 24 24" 
                                height="1.2em" 
                                width="1.2em" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"></path>
                                </g>
                            </svg>
                            <span>Supprimer</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}