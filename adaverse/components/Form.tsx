"use client";

import { FormEvent, useState } from "react";

type Props = {
    promo: Array<{ id: number; name: string }>;
    type: Array<{ id: number; name: string }>;
    onSuccess: () => void; 
};

export default function Form({ promo, type, onSuccess }: Props) {
    const [newProjectType, setNewProjectType] = useState({
        title: "",
        github_url: "",
        demo_url: "",
        promotion_id: "",
        project_type_id: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const FormAction = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/project_students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProjectType),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Projet créé avec succès :", data);
                
                setNewProjectType({
                    title: "",
                    github_url: "",
                    demo_url: "",
                    promotion_id: "",
                    project_type_id: "",
                });
                
        
                onSuccess();
            } else {
          
                setError(data.error || "Erreur lors de la création du projet");
            }
        } catch (error) {

            console.error("Erreur réseau :", error);
            setError("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="text-center text-2xl font-bold mb-4">Proposer un projet</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={FormAction} className="flex flex-col gap-3">

                <label htmlFor="title" className="font-bold">Titre</label>
                <input
                    id="title"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    type="text"
                    placeholder="Ex: Mon super projet"
                    value={newProjectType.title}
                    onChange={(e) =>
                        setNewProjectType({
                            ...newProjectType,
                            title: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                />

                <label htmlFor="github_url" className="font-bold">URL Github</label>
                <input
                    id="github_url"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={newProjectType.github_url}
                    onChange={(e) =>
                        setNewProjectType({
                            ...newProjectType,
                            github_url: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                />

                <label htmlFor="demo_url" className="font-bold">URL de démo</label>
                <input
                    id="demo_url"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    type="url"
                    placeholder="https://monprojet.vercel.app"
                    value={newProjectType.demo_url}
                    onChange={(e) =>
                        setNewProjectType({
                            ...newProjectType,
                            demo_url: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                />

                <label htmlFor="promotion_id" className="font-bold">Promo ADA</label>
                <select
                    id="promotion_id"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    value={newProjectType.promotion_id}
                    onChange={(e) =>
                        setNewProjectType({
                            ...newProjectType,
                            promotion_id: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                >
                    <option value="">-- Choisir une promotion --</option>
                    {promo.map((promotion) => (
                        <option key={promotion.id} value={promotion.id}>
                            {promotion.name.toUpperCase()}
                        </option>
                    ))}
                </select>

                <label htmlFor="project_type_id" className="font-bold">Type de projet</label>
                <select
                    id="project_type_id"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    value={newProjectType.project_type_id}
                    onChange={(e) =>
                        setNewProjectType({
                            ...newProjectType,
                            project_type_id: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                >
                    <option value="">-- Choisir un type --</option>
                    {type.map((projectType) => (
                        <option key={projectType.id} value={projectType.id}>
                            {projectType.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-amber-700 hover:bg-amber-800 text-white p-3 rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </button>
            </form>
        </>
    );
}