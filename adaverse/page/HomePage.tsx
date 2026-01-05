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
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

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

  async function fetchDataAdaProjects() {
    const res = await fetch("/api/ada_projects");
    const result = await res.json();
    setGetAdaProjects(result);
  }

  async function fetchDataPromotions() {
    const res = await fetch("/api/promotions");
    const result = await res.json();
    setGetPromotions(result);
  }

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
        (project: any) => project.adaProjectsId === Number(typeId)
      );
      setFilteredProjects(filtered);
    }
  };

  const sessionProjects = session && getFormData.filter((project: Projects) => project.userId === session.user.id);
  console.log("Session Projects:", sessionProjects);



  const handleProjectDeleted = () => {
    fetchProjects();
    setSelectedFilter("");
  };

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
          onClose={() => {
            setIsModalOpen(false);
            fetchProjects();
            setSelectedFilter("");
          }}
        />
      )}

      <main className="flex-1 p-1 md:p-2 m-1 md:m-2 relative z-10">
        <div className="relative text-white text-lg md:text-2xl flex flex-col gap-2">
          {isLoading ? (
            <p className="text-gray-400 text-base md:text-lg">Chargement des projets...</p>
          ) : (
            <div>
              {session && (
                <>
                  <h1 className="text-xl md:text-2xl">Mes projets ({sessionProjects.length})</h1>
                  <div className='flex flex-wrap gap-2 md:gap-4'>
                    {Array.isArray(sessionProjects) && sessionProjects.map((project) => (
                      <ProjectsCards
                        session={session}
                        item={project}
                        onProjectDeleted={handleProjectDeleted}
                      />
                    ))}
                  </div>
                </>
              )}
              <h1 className="text-xl md:text-2xl mt-4">Tous les projets ({filteredProjects.length})</h1>

              <div className='flex flex-wrap gap-2 md:gap-4'>
                {Array.isArray(filteredProjects) && filteredProjects.length === 0 ? (
                  <p className='text-gray-400 text-base md:text-lg'>Aucun projet pour le moment.</p>
                ) : (
                  Array.isArray(getAdaProjects) && getAdaProjects.map((adaProject) => (
                    <div key={adaProject.id} className="w-full">
                      { filteredProjects.filter((project: Projects) => project.adaProjectsId === adaProject.id).length === 0 ? null : (
                      <h2 className="text-lg md:text-xl w-full mt-2 mb-1">{adaProject.name} ({filteredProjects.filter((project: Projects) => project.adaProjectsId === adaProject.id).length})</h2>
                      )}
                      <div className='flex flex-wrap gap-2 md:gap-4'>
                        {Array.isArray(filteredProjects) && filteredProjects
                          .filter((project: Projects) => project.adaProjectsId === adaProject.id)
                          .map((item) => (
                            <ProjectsCards
                              key={item.id}
                              session={session}
                              item={item}
                              onProjectDeleted={handleProjectDeleted}
                            />
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}