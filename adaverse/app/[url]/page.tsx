"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormatDate } from '@/utils/FormatDate';

// Construit l'URL raw de thumbnail.png à partir du githubUrl
function getThumbnailUrl(githubUrl: string) {
  if (!githubUrl) return '';
  const match = githubUrl.match(/github.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return '';
  const user = match[1];
  const repo = match[2];
  return `https://raw.githubusercontent.com/${user}/${repo}/main/thumbnail.png`;
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
  const { url } = params as { url?: string };
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
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

  const githubUsername = getGithubUsername(project.githubUrl);

  return (
    <div className="min-h-full flex flex-col">
      {/* Header simplifié */}
      <div className="p-2 m-2 rounded-xl relative z-10">
        <div className="flex gap-4 items-center bg-gray-500 p-3 rounded-xl shadow-md">
          <h1 className="font-bold text-[#f3d5d5] text-2xl cursor-pointer hover:opacity-80 transition" onClick={() => router.push('/')}>
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

      {/* Contenu du projet */}
      <main className="flex-1 p-2 m-2 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Carte du projet */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
            {/* Badge promo en haut à droite */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1"></div>
              <span className="bg-gradient-to-r from-red-500 to-blue-600 text-white font-bold text-sm px-6 py-2 rounded-xl shadow-lg border-2 border-blue-600">
                {project.promotionName || 'N/A'}
              </span>
            </div>

            {/* GitHub Username */}
            <div className="text-center mb-4">
              <h2 className="text-cyan-600 text-3xl font-extrabold tracking-wide">
                {githubUsername}
              </h2>
            </div>

            {/* Image du projet */}
            <div className="w-full bg-cyan-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '500px' }}>
              <img
                src={getThumbnailUrl(project.githubUrl) || '/image/no_image_available.png'}
                alt="Aperçu du projet"
                className="w-full h-auto max-h-[500px] object-contain"
                onError={(e) => { e.currentTarget.src = '/image/no_image_available.png'; }}
              />
            </div>

            {/* Titre du projet */}
            <h1 className="text-blue-500 text-4xl font-black text-center mb-2 tracking-tight">
              {project.title}
            </h1>

            {/* Catégorie */}
            <div className="text-center mb-8">
              <span className="text-cyan-600 text-2xl font-bold">
                {project.adaProjectsName || 'Inconnu'}
              </span>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 justify-center mb-6 flex-wrap">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Voir le code</span>
              </a>

              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-cyan-500 hover:to-emerald-600 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Voir la Démo</span>
                </a>
              ) : (
                <span className="flex items-center gap-2 bg-gray-600 text-gray-300 font-medium text-base px-6 py-3 rounded-xl">
                  Aucune démo
                </span>
              )}
            </div>

            {/* Date d'ajout */}
            <div className="text-center bg-cyan-50 text-gray-700 rounded-lg py-3 px-4">
              <span className="font-medium">Ajouté le : </span>
              <span className="font-bold">{FormatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}