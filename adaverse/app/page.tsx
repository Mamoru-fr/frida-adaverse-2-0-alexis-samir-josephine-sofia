"use client"

import {useState, useEffect} from "react";
import Header from "../components/Header";
import ProjectsCards from "../components/ProjectsCards";
import {ProjectTypes, Promotions} from "../content/interface";
import AddProjectButton from "../components/AddProjectButton";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [getTypes, setGetTypes] = useState<ProjectTypes[]>([]);
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

  async function fetchDataType() {
    const res = await fetch("/api/project_types");
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
        (project: any) => project.projectTypeId === Number(typeId)
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
          data={getTypes}
          openModal={() => setIsModalOpen(true)}
          onFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
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