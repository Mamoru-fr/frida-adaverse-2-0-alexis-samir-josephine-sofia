'use client';
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {signin, signup} from "@/actions/signActions";
import Header from "@/components/Header";
import {adaProjects, Projects, Promotions} from "@/content/interface";
import AddProjectButton from "@/components/AddProjectButton";
import {ErrorMessage} from "@/components/ErrorMessage";

interface Props {
    session: any;
}

export default function SignPage({session}: Props) {
    const searchParams = useSearchParams();
    const viewParam = searchParams.get('view') as "signin" | "signup" | null;
    const [view, setView] = useState<"signin" | "signup">(viewParam || "signin");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [getTypes, setGetTypes] = useState<adaProjects[]>([]);
    const [getPromotions, setGetPromotions] = useState<Promotions[]>([]);
    const [getFormData, setGetFormData] = useState<Projects[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const toggleView = () => {
        setView(view === 'signin' ? 'signup' : 'signin');
    };

    const fetchData = async (endpoint: string, setter: (data: any) => void, isProjectsFetch = false) => {
        if (isProjectsFetch) setIsLoading(true);
        try {
            const res = await fetch(endpoint);
            const result = await res.json();
            setter(result);
            if (isProjectsFetch) setFilteredProjects(result);
        } catch (error) {
            console.error(`Erreur lors de la récupération depuis ${endpoint}:`, error);
        } finally {
            if (isProjectsFetch) setIsLoading(false);
        }
    };

    const fetchProjects = () => fetchData("/api/project_students", setGetFormData, true);
    const fetchDataType = () => fetchData("/api/ada_projects", setGetTypes);
    const fetchDataPromotions = () => fetchData("/api/promotions", setGetPromotions);

    useEffect(() => {
        fetchDataType();
        fetchDataPromotions();
        fetchProjects();
    }, []);

    useEffect(() => {
        const error = searchParams.get('error');
        const viewParam = searchParams.get('view') as "signin" | "signup" | null;
        
        if (viewParam) {
            setView(viewParam);
        }
        
        if (error && error !== 'true') {
            setErrorMessage(decodeURIComponent(error));
        } else {
            setErrorMessage(null);
        }
    }, [searchParams]);

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


    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchProjects();
        setSelectedFilter("");
    };

    const renderFormField = (label: string, name: string, type: string, placeholder: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label} *</label>
            <input
                type={type}
                name={name} // Doit correspondre au (ex `formData.get("email")` dans `signin`)
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={placeholder}
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="p-1 md:p-2 m-1 md:m-2 rounded-xl relative z-10">
                {/* <pre className="text-white">{session ? JSON.stringify(session.user, null, 2) : "Not connected"}</pre> */}
            </div>

            <div className="p-1 md:p-2 m-1 md:m-2 rounded-xl relative z-10">
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
                    onClose={handleModalClose}
                />
            )}

            <main className="flex-1 p-1 md:p-2 m-1 md:m-2 relative z-10 flex items-center justify-center min-h-0">
                <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-md mx-2">
                    <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
                        {view === 'signin' ? 'Connexion' : 'Inscription'}
                    </h1>

                    {errorMessage && (
                        <ErrorMessage 
                            message={errorMessage} 
                            onClose={() => setErrorMessage(null)}
                        />
                    )}

                    {/* Formulaire de connexion */}
                    {view === 'signin' && (
                        <form action={signin} className="space-y-4">
                            {renderFormField('Email', 'email', 'email', 'Votre email')}
                            {renderFormField('Mot de passe', 'password', 'password', 'Votre mot de passe')}
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Se connecter
                            </button>
                        </form>
                    )}

                    {/* Formulaire d'inscription */}
                    {view === 'signup' && (
                        <form action={signup} className="space-y-4">
                            {renderFormField('Nom', 'name', 'text', 'Votre nom')}
                            {renderFormField('Email', 'email', 'email', 'Votre email')}
                            {renderFormField('Mot de passe', 'password', 'password', 'Votre mot de passe')}
                            {renderFormField('Confirmer le mot de passe', 'confirmPassword', 'password', 'Votre mot de passe')}
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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