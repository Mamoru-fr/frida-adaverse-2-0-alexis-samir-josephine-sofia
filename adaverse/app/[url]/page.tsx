"use client";

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {FormatDatePlainText} from '@/utils/FormatDate';
import {adaProjects, Projects, Promotions} from '@/content/interface';
import {Image} from 'lucide-react';

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

export default function StudentProjectDetail() {
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
    <div className="min-h-full flex flex-col relative">
      {/* Header */}
      <div className="p-2 m-2 rounded-xl relative z-10">
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

      {/* Image en haut avec effet de flou */}
      <div className="relative w-[78vw] h-[50vh] overflow-hidden z-10 mx-auto">
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
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-gray-900 backdrop-blur-sm"></div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-2 m-2 relative z-10">
        <div className="max-w-6xl mx-auto -mt-20">
          {/* Titre et Date de création */}
          <div className="bg-gray-500/95 backdrop-blur-md rounded-xl p-6 shadow-md mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-[#f3d5d5] text-3xl md:text-4xl font-bold mb-2">
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
          <div className="flex flex-col gap-4">
            {/* Première ligne - 3 cartes */}
            <div className="flex flex-wrap gap-4">
              {/* Carte Promotion */}
              <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">Promotion</h3>
                </div>
                <p className="text-gray-200 mb-3 text-sm">Promotion ada</p>
                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                  {promotions?.name || 'N/A'}
                </div>
              </div>

              {/* Carte Auteur */}
              <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">Auteur</h3>
                </div>
                <p className="text-gray-200 mb-3 text-sm">Développeur</p>
                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                  {githubUsername}
                </div>
              </div>

              {/* Carte Projet Ada */}
              <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">Type</h3>
                </div>
                <p className="text-gray-200 mb-3 text-sm">Catégorie</p>
                <div className="text-center bg-black/30 text-white font-semibold text-base py-2 rounded">
                  {adaProjects?.name || 'Inconnu'}
                </div>
              </div>
            </div>

            {/* Deuxième ligne - 2 cartes */}
            <div className="flex flex-wrap gap-4">
              {/* Carte GitHub */}
              <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
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
              <div className="bg-gray-500/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:bg-gray-500 transition-all flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
      </div>
    </div>
  );
}