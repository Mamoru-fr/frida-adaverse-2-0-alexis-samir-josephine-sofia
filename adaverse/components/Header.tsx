"use client"

import {redirect} from "next/navigation";
import {SignInHeaderButton} from "./SignInHeaderButton";
import {SignOutHeaderButton} from "./SignOutHeaderButton";
import {useRouter} from "next/navigation";
import {Folder, User} from "lucide-react";

interface HeaderProps {
    openModal: () => void;
    data: any[];
    onFilterChange: (typeId: string) => void;
    selectedFilter: string;
    session: any;
}

export default function Header({openModal, data, onFilterChange, selectedFilter, session}: HeaderProps) {
    const router = useRouter();

    const handleSubmitProject = () => {
        if (!session) {
            redirect('/connections');
        } else {
            openModal();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 md:gap-4 items-center bg-gray-500 p-2 md:p-3 rounded-xl shadow-md">
            <h1 className="font-bold text-[#f3d5d5] text-xl md:text-2xl cursor-pointer" onClick={() => router.push('/')}>
                ada<span>VERSE</span>
            </h1>

            <div className="flex-1 min-w-0"></div>

            <select
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="p-2 cursor-pointer text-white bg-black rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-700 text-xs md:text-sm max-w-[140px] md:max-w-none"
            >
                <option value="">TOUS LES PROJETS</option>
                {data.map((adaProjects: {id: number; name: string}) => (
                    <option key={adaProjects.id} value={adaProjects.id}>
                        {adaProjects.name.toUpperCase()}
                    </option>
                ))}
            </select>

            {session ? (
                <SignOutHeaderButton />
            ) : (
                <SignInHeaderButton />
            )}

            <button
                className="p-2 px-3 md:px-4 cursor-pointer bg-amber-700 text-white rounded hover:bg-amber-800 transition font-medium text-xs md:text-sm whitespace-nowrap"
                onClick={handleSubmitProject}
            >
                <span className="inline">SOUMETTRE UN PROJET</span>
            </button>

            <button
                className="p-2 cursor-pointer bg-amber-700 hover:bg-amber-800 rounded-full transition flex items-center justify-center"
                onClick={() => alert("Mes projets")}
                title="Mes projets"
            >
                <Folder className="text-white w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                className="p-2 cursor-pointer bg-white rounded-full transition flex items-center justify-center"
                onClick={() => alert("Fonctionnalité de profil à venir")}
                title="Profil"
            >
                <User className="text-amber-700 w-5 h-5 md:w-6 md:h-6" />
            </button>
        </div>
    )
}