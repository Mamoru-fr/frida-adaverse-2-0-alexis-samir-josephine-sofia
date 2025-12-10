"use client";

import { useState } from "react";
import { Promotions, adaProjects } from "@/content/interface";
import { FormAction } from "@/actions/AddProjectFormActions";

type Props = {
    promo: Array<Promotions>;
    type: Array<adaProjects>;
    onSuccess: () => void; 
};

export default function AddProjectModal({ promo, type, onSuccess }: Props) {
    const [newadaProjects, setNewadaProjects] = useState({
        title: "",
        github_url: "",
        demo_url: "",
        promotion_id: "",
        ada_projects_id: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <h1 className="text-center text-2xl font-bold mb-4">Proposer un projet</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={(e) => FormAction({e, setIsSubmitting, setError, setNewadaProjects, newadaProjects, onSuccess})} className="flex flex-col gap-3">

                <label htmlFor="title" className="font-bold">Titre</label>
                <input
                    id="title"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    type="text"
                    placeholder="Ex: Mon super projet"
                    value={newadaProjects.title}
                    onChange={(e) =>
                        setNewadaProjects({
                            ...newadaProjects,
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
                    value={newadaProjects.github_url}
                    onChange={(e) =>
                        setNewadaProjects({
                            ...newadaProjects,
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
                    value={newadaProjects.demo_url}
                    onChange={(e) =>
                        setNewadaProjects({
                            ...newadaProjects,
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
                    value={newadaProjects.promotion_id}
                    onChange={(e) =>
                        setNewadaProjects({
                            ...newadaProjects,
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

                <label htmlFor="ada_projects_id" className="font-bold">Type de projet</label>
                <select
                    id="ada_projects_id"
                    className="border-2 p-2 rounded focus:outline-none focus:border-amber-700"
                    value={newadaProjects.ada_projects_id}
                    onChange={(e) =>
                        setNewadaProjects({
                            ...newadaProjects,
                            ada_projects_id: e.target.value,
                        })
                    }
                    required
                    disabled={isSubmitting}
                >
                    <option value="">-- Choisir un type --</option>
                    {type.map((adaProjects) => (
                        <option key={adaProjects.id} value={adaProjects.id}>
                            {adaProjects.name}
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