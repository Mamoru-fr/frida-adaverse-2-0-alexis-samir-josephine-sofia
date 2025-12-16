"use client"

import {redirect} from "next/navigation";
import {SignInHeaderButton} from "./SignInHeaderButton";
import {SignOutHeaderButton} from "./SignOutHeaderButton";
import {useRouter} from "next/navigation";

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
        <div className="flex gap-4 items-center bg-gray-500 p-3 rounded-xl shadow-md">
            <h1 className="font-bold text-[#f3d5d5] text-2xl cursor-pointer" onClick={() => router.push('/')}>
                ada<span>VERSE</span>
            </h1>

            <div className="flex-1"></div>

            {session ? (
                <SignOutHeaderButton />
            ) : (
                <SignInHeaderButton />
            )}


            <select
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="p-2 cursor-pointer text-white bg-black rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-700"
            >
                <option value="">TOUS LES PROJETS</option>
                {data.map((adaProjects: {id: number; name: string}) => (
                    <option key={adaProjects.id} value={adaProjects.id}>
                        {adaProjects.name.toUpperCase()}
                    </option>
                ))}
            </select>

            <button
                className="p-2 px-4 cursor-pointer bg-amber-700 text-white rounded hover:bg-amber-800 transition font-medium"
                onClick={handleSubmitProject}
            >
                SOUMETTRE LE PROJET
            </button>

            <button
                className="p-2 cursor-pointer bg-amber-700 hover:bg-amber-800 rounded-full transition flex items-center justify-center"
                onClick={() => alert("Mes projets")}
                title="Mes projets"
            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="1.5em"
                    width="1.5em"
                    className="text-white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fillRule="evenodd" d="M9.828 3h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0113.174 14H2.826a2 2 0 01-1.991-1.819l-.637-7a1.99 1.99 0 01.342-1.31L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 006.172 2H2.5a1 1 0 00-1 .981l.006.139z" clipRule="evenodd"></path>
                </svg>
            </button>

            <button
                className="p-2 cursor-pointer bg-white rounded-full transition flex items-center justify-center"
                onClick={() => alert("Fonctionnalité de profil à venir")}
                title="Profil"
            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    width="1.5em"
                    className="text-amber-700"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                </svg>
            </button>
        </div>
    )
}