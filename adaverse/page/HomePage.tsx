"use client"

import {useState, useEffect} from "react";
import Header from "../components/Header";
import ProjectsCards from "../components/ProjectsCards";
import {adaProjects, Promotions} from "../content/interface";
import AddProjectButton from "../components/AddProjectButton";

export default function HomePage({ session }: { session: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [getAdaProjects, setGetAdaProjects] = useState<adaProjects[]>([]);
  const [getPromotions, setGetPromotions] = useState<Promotions[]>([]);
  const [getFormData, setGetFormData] = useState<any>([]);
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

  const handleProjectDeleted = () => {
    fetchProjects();
    setSelectedFilter("");
  };

  return (
    <div className="min-h-full flex flex-col relative">

      <div className="p-2 m-2 rounded-xl relative z-10">
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

      <main className="flex-1 p-2 m-2 relative z-10">
        <div className="relative text-white text-2xl flex flex-col gap-2">
          {isLoading ? (
            <p className="text-gray-400">Chargement des projets...</p>
          ) : (
            <ProjectsCards
              form={filteredProjects}
              onProjectDeleted={handleProjectDeleted}
            />
          )}
        </div>
      </main>

      
    </div>
  )
}