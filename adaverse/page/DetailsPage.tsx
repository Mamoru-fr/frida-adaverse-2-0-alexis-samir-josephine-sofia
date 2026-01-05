"use client";

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {FormatDatePlainText} from '@/utils/FormatDate';
import {adaProjects, Projects, Promotions} from '@/content/interface';
import {Github, Image, Palette, PlayCircle, User, Users} from 'lucide-react';
import {AllComments} from '@/components/Comments/AllComments';

// Construit l'URL raw de thumbnail.png à partir du githubUrl
function getThumbnailUrl(githubUrl: string) {
    if (!githubUrl) return '';
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return '';
    return `${githubUrl}/blob/main/thumbnail.png?raw=true`;
}

// Extrait le nom d'utilisateur GitHub depuis l'URL
function getGithubUsername(githubUrl: string) {
    if (!githubUrl) return 'inconnu';
    const match = githubUrl.match(/github.com\/([^\/]+)\//);
    return match ? match[1] : 'inconnu';
}

export default function DetailsPage({session}: {session: any}) {
    const params = useParams();
    const router = useRouter();
    const {url} = params as {url?: string};
    const [project, setProject] = useState<Projects>();
    const [adaProjects, setAdaProjects] = useState<adaProjects>();
    const [promotions, setPromotions] = useState<Promotions>();
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (!url) return;

        setLoading(true);
        fetch('/api/project_students')
            .then(res => res.json())
            .then(data => {
                const found = data.find((p: any) => p.slug === url);
                setProject(found);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching project:', error);
                setLoading(false);
            });
    }, [url]);

    useEffect(() => {
        if (project) {
            // Fetch adaProjects
            fetch('/api/ada_projects')
                .then(res => res.json())
                .then(data => {
                    const found = data.find((p: any) => p.id === project.adaProjectsId);
                    setAdaProjects(found);
                })
                .catch(error => {
                    console.error('Error fetching ada projects:', error);
                });

            fetch('/api/promotions')
                .then(res => res.json())
                .then(data => {
                    const found = data.find((p: any) => p.id === project.promotionId);
                    setPromotions(found);
                })
                .catch(error => {
                    console.error('Error fetching promotions:', error);
                });
        }
    }, [project]);



    if (loading) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="p-2 m-2 rounded-xl">
                    <div className="flex gap-4 items-center bg-gray-500 p-3 rounded-xl shadow-md">
                        <h1 className="font-bold text-[#f3d5d5] text-2xl cursor-pointer" onClick={() => router.push('/')}>
                            ada<span>VERSE</span>
                        </h1>
                        <div className="flex-1"></div>
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 px-4 cursor-pointer bg-amber-700 text-white rounded hover:bg-amber-800 transition font-medium"
                        >
                            RETOUR À L'ACCUEIL
                        </button>
                    </div>
                </div>
                <main className="flex-1 p-2 m-2 flex items-center justify-center">
                    <p className="text-white text-2xl">Chargement du projet...</p>
                </main>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="p-2 m-2 rounded-xl">
                    <div className="flex gap-4 items-center bg-gray-500 p-3 rounded-xl shadow-md">
                        <h1 className="font-bold text-[#f3d5d5] text-2xl cursor-pointer" onClick={() => router.push('/')}>
                            ada<span>VERSE</span>
                        </h1>
                    </div>
                </div>
                <main className="flex-1 p-2 m-2 flex items-center justify-center">
                    <p className="text-red-500 text-2xl">Projet non trouvé</p>
                </main>
            </div>
        );
    }

    const githubUsername = getGithubUsername(project!.githubUrl);
    const thumbnailUrl = getThumbnailUrl(project!.githubUrl);

    console.log('Project data:', project);
    console.log('Thumbnail URL:', thumbnailUrl);

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Header */}
            <div className="p-1 md:p-2 m-1 md:m-2 rounded-xl relative z-10">
                <div className="flex flex-wrap gap-2 md:gap-4 items-center bg-gray-500 p-2 md:p-3 rounded-xl shadow-md">
                    <h1 className="font-bold text-[#f3d5d5] text-xl md:text-2xl cursor-pointer" onClick={() => router.push('/')}>
                        ada<span>VERSE</span>
                    </h1>
                    <div className="flex-1 min-w-0"></div>
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 px-3 md:px-4 cursor-pointer bg-amber-700 text-white rounded hover:bg-amber-800 transition font-medium text-xs md:text-sm whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">RETOUR À L'ACCUEIL</span>
                        <span className="sm:hidden">RETOUR</span>
                    </button>
                </div>
            </div>

            {/* Image en haut avec effet de flou */}
            <div className="relative w-[95vw] md:w-[78vw] max-w-6xl h-[30vh] md:h-[50vh] overflow-hidden z-10 mx-auto">
                <div className="absolute inset-0 bg-gray-700 rounded-4xl overflow-hidden shadow-lg flex items-center justify-center">
                    {thumbnailUrl && !imageError ? (
                        <img
                            src={thumbnailUrl}
                            alt="Aperçu du projet"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.log('Image failed to load:', thumbnailUrl);
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <Image className="w-32 h-32 text-gray-500" strokeWidth={1.5} />
                    )}
                    {/* Overlay avec gradient flou uniquement en bas */}
                    {thumbnailUrl && !imageError && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b rounded-xl from-transparent to-gray-900 backdrop-blur-sm"></div>
                    )}
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 p-1 md:p-2 m-1 md:m-2 relative z-10">
                <div className="max-w-6xl mx-auto -mt-10 md:-mt-20">
                    {/* Titre et Date de création */}
                    <div className="bg-gray-500/95 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-md mb-4 md:mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-[#f3d5d5] text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                                    {project.title}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-white text-lg font-semibold">
                                        {`Créé le ${FormatDatePlainText(project.createdAt)}` || 'Date inconnue'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cartes d'informations en flex */}
                    <div className="flex flex-col gap-3 md:gap-4">
                        {/* Première ligne - 3 cartes */}
                        <div className="flex flex-wrap gap-3 md:gap-4">
                            {/* Carte Promotion */}
                            <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[200px] md:min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="w-7 h-7 text-white" />
                                    <h3 className="text-lg font-bold text-white">Promotion</h3>
                                </div>
                                <p className="text-gray-200 mb-3 text-sm">Promotion ada</p>
                                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                                    {promotions?.name || 'N/A'}
                                </div>
                            </div>

                            {/* Carte Auteur */}
                            <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[200px] md:min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <User className="w-7 h-7 text-white" />
                                    <h3 className="text-lg font-bold text-white">Auteur</h3>
                                </div>
                                <p className="text-gray-200 mb-3 text-sm">Développeur</p>
                                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                                    {githubUsername}
                                </div>
                            </div>

                            {/* Carte Projet Ada */}
                            <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[200px] md:min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <Palette className="w-7 h-7 text-white" />
                                    <h3 className="text-lg font-bold text-white">Type</h3>
                                </div>
                                <p className="text-gray-200 mb-3 text-sm">Catégorie</p>
                                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                                    {adaProjects?.name || 'Inconnu'}
                                </div>
                            </div>
                        </div>

                        {/* Deuxième ligne - 2 cartes */}
                        <div className="flex flex-wrap gap-3 md:gap-4">
                            {/* Carte GitHub */}
                            <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[200px] md:min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <Github className="w-7 h-7 text-white" />
                                    <h3 className="text-lg font-bold text-white">Code Source</h3>
                                </div>
                                <p className="text-gray-200 mb-3 text-sm">Repository GitHub</p>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 rounded transition"
                                >
                                    Voir le code
                                </a>
                            </div>

                            {/* Carte Démo */}
                            <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[200px] md:min-w-[250px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <PlayCircle className="w-7 h-7 text-white" />
                                    <h3 className="text-lg font-bold text-white">Démonstration</h3>
                                </div>
                                <p className="text-gray-200 mb-3 text-sm">
                                    {project.demoUrl ? 'Projet en ligne' : 'Pas de démo'}
                                </p>
                                {project.demoUrl ? (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 rounded transition"
                                    >
                                        Voir la démo
                                    </a>
                                ) : (
                                    <div className="block w-full text-center bg-gray-600 text-gray-300 font-medium py-2 rounded cursor-not-allowed">
                                        Non disponible
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <AllComments projectId={project.id} session={session} />
            </div>
        </div>
    );
}