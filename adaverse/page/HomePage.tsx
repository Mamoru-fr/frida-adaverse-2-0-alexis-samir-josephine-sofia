"use client"

import {useState, useEffect} from "react";
import Header from "../components/Header";
import ProjectsCards from "../components/ProjectsCards";
import {adaProjects, Projects, Promotions} from "../content/interface";
import AddProjectButton from "../components/AddProjectButton";

export default function HomePage({session}: {session: any}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [getAdaProjects, setGetAdaProjects] = useState<adaProjects[]>([]);
  const [getPromotions, setGetPromotions] = useState<Promotions[]>([]);
  const [getFormData, setGetFormData] = useState<Projects[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchDataAdaProjects = () => fetchData("/api/ada_projects", setGetAdaProjects);
  const fetchDataPromotions = () => fetchData("/api/promotions", setGetPromotions);
  const fetchProjects = () => fetchData("/api/project_students", setGetFormData, true);

  useEffect(() => {
    fetchDataAdaProjects();
    fetchDataPromotions();
    fetchProjects();
  }, []);

  const handleFilterChange = (typeId: string) => {
    setSelectedFilter(typeId);

    if (typeId === "") {
      setFilteredProjects(getFormData);
    } else {
      const filtered = getFormData.filter(
        (project: Projects) => project.adaProjectsId === Number(typeId)
      );
      setFilteredProjects(filtered);
    }
  };

  const sessionProjects = session && getFormData.filter((project: Projects) => project.userId === session.user.id);

  const handleProjectDeleted = () => {
    fetchProjects();
    setSelectedFilter("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProjects();
    setSelectedFilter("");
  };

  const renderProjectsList = (projects: Projects[], title: string, titleStyle: string) => {
    if (!Array.isArray(projects) || projects.length === 0) return null;
    
    return (
      <>
        <h1 className={`${titleStyle}`}>{title} ({projects.length})</h1>
        <div className='flex flex-wrap gap-2 md:gap-4'>
          {projects.map((project) => (
            <ProjectsCards
              key={project.id}
              session={session}
              item={project}
              onProjectDeleted={handleProjectDeleted}
            />
          ))}
        </div>
      </>
    );
  };

  const getProjectsByAdaType = (adaProjectId: number) => 
    filteredProjects.filter((project: Projects) => project.adaProjectsId === adaProjectId);

  return (
    <div className="min-h-screen flex flex-col relative">

      <div className="p-1 md:p-2 m-1 md:m-2 rounded-xl relative z-10">
        <Header
          data={getAdaProjects}
          openModal={() => setIsModalOpen(true)}
          onFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
          session={session}
        />
      </div>

      {isModalOpen && (
        <AddProjectButton
          getpromo={getPromotions}
          gettype={getAdaProjects}
          onClose={handleModalClose}
        />
      )}

      <main className="flex-1 p-1 md:p-2 m-1 md:m-2 relative z-10">
        <div className="relative text-white text-lg md:text-2xl flex flex-col gap-2">
          {isLoading ? (
            <p className="text-gray-400 text-base md:text-lg">Chargement des projets...</p>
          ) : (
            <div>
              {session && renderProjectsList(sessionProjects, "Mes projets", "text-xl md:text-2xl mt-4")}
              
              <h1 className="text-xl md:text-2xl mt-4">Tous les projets ({filteredProjects.length})</h1>

              <div className='flex flex-wrap gap-2 md:gap-4'>
                {filteredProjects.length === 0 ? (
                  <p className='text-gray-400 text-base md:text-lg'>Aucun projet pour le moment.</p>
                ) : (
                  getAdaProjects.map((adaProject) => {
                    const projectsByType = getProjectsByAdaType(adaProject.id);
                    if (projectsByType.length === 0) return null;
                    
                    return (
                      <div key={adaProject.id} className="w-full">
                        {renderProjectsList(projectsByType, adaProject.name, "text-lg md:text-xl w-full mt-2 mb-1")}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}