'use client';
import {useEffect, useState} from "react";
import {signin, signup} from "@/actions/signActions";
import Header from "@/components/Header";
import {adaProjects, Promotions} from "@/content/interface";
import AddProjectButton from "@/components/AddProjectButton";

interface Props {
    session: any;
}

export default function SignPage({session}: Props) {
    const [view, setView] = useState<"signin" | "signup">("signin");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [getTypes, setGetTypes] = useState<adaProjects[]>([]);
    const [getPromotions, setGetPromotions] = useState<Promotions[]>([]);
    const [getFormData, setGetFormData] = useState<any>([]);
    const [filteredProjects, setFilteredProjects] = useState<any>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const toggleView = () => {
        setView(view === 'signin' ? 'signup' : 'signin');
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/project_students");
            const result = await res.json();
            setGetFormData(result);
            setFilteredProjects(result);
        } catch (error) {
            console.error("Erreur lors de la récupération des projets :", error);
        } finally {
            setIsLoading(false);
        }
    };

    async function fetchDataType() {
        const res = await fetch("/api/ada_projects");
        const result = await res.json();
        setGetTypes(result);
    }

    async function fetchDataPromotions() {
        const res = await fetch("/api/promotions");
        const result = await res.json();
        setGetPromotions(result);
    }

    useEffect(() => {
        fetchDataType();
        fetchDataPromotions();
        fetchProjects();
    }, []);

    const handleFilterChange = (typeId: string) => {
        setSelectedFilter(typeId);

        if (typeId === "") {
            setFilteredProjects(getFormData);
        } else {
            const filtered = getFormData.filter(
                (project: any) => project.adaProjectsId === Number(typeId)
            );
            setFilteredProjects(filtered);
        }
    };

    const handleProjectDeleted = () => {
        fetchProjects();
        setSelectedFilter("");
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="p-2 m-2 rounded-xl relative z-10">
                {/* <pre className="text-white">{session ? JSON.stringify(session.user, null, 2) : "Not connected"}</pre> */}
            </div>

            <div className="p-2 m-2 rounded-xl relative z-10">
                <Header
                    data={getTypes}
                    openModal={() => setIsModalOpen(true)}
                    onFilterChange={handleFilterChange}
                    selectedFilter={selectedFilter}
                    session={session}
                />
            </div>

            {isModalOpen && (
                <AddProjectButton
                    getpromo={getPromotions}
                    gettype={getTypes}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchProjects();
                        setSelectedFilter("");
                    }}
                />
            )}

            <main className="flex-1 p-2 m-2 relative z-10 flex items-center justify-center min-h-0">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        {view === 'signin' ? 'Connexion' : 'Inscription'}
                    </h1>

                    {/* Formulaire de connexion */}
                    {view === 'signin' && (
                        <form action={signin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    name="email" // Doit correspondre au `formData.get("email")` dans `signin`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mot de passe * </label>
                                <input
                                    type="password"
                                    name="password" // Doit correspondre au `formData.get("password")` dans `signin`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Se connecter
                            </button>
                        </form>
                    )}

                    {/* Formulaire d'inscription */}
                    {view === 'signup' && (
                        <form action={signup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    type="text"
                                    name="name" // Doit correspondre au `formData.get("name")` dans `signup`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    name="email" // Doit correspondre au `formData.get("email")` dans `signup`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                                <input
                                    type="password"
                                    name="password" // Doit correspondre au `formData.get("password")` dans `signup`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                                <input
                                    type="password"
                                    name="confirmPassword" // Doit correspondre au `formData.get("confirmPassword")` dans `signup`
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                S'inscrire
                            </button>
                        </form>
                    )}

                    {/* Bouton pour basculer entre les formulaires */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={toggleView}
                            className="text-[16px] text-indigo-600 hover:text-indigo-500"
                        >
                            {view === 'signin'
                                ? "Pas encore de compte ? S'inscrire"
                                : 'Déjà un compte ? Se connecter'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}