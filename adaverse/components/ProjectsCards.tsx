'use client'

import { useState } from 'react'
import { EditProjectsCards } from './EditProjectsCards'
import { FormatDate } from '@/utils/FormatDate'
import {redirect} from 'next/navigation';
import { Folder, Eye, Github } from 'lucide-react';

interface CardsProps {
    form: any[];
    onProjectDeleted: () => void;
    session: string | null;
}

export default function ProjectsCards({ form, onProjectDeleted, session }: CardsProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

    return (
        <>
        {session && (
            <>
                <h1>Mes projets ({form.length})</h1>
                {Array.isArray(form) && form.map((project) => (
                    <div key={project.id}>
                        <h2>{project.title}</h2>
                    </div>
                ))}
            </>
        )}
        
            <h1>Tous les projets ({form.length})</h1>
            <div className='flex flex-wrap gap-4'>
                {Array.isArray(form) && form.length === 0 ? (
                    <p className='text-gray-400'>Aucun projet pour le moment.</p>
                ) : (
                    Array.isArray(form) && form.map((item) => (
                        <div key={item.id} className='relative flex-1 min-w-[280px] max-w-[350px] h-80 cursor-pointer group' onClick={() => redirect(`/${item.slug}`)}>

                            <div className='absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg'></div>

                            {/* Hover overlay with details indicator */}
                            <div className='absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none'>
                                <div className='text-center'>
                                    <Eye className='w-12 h-12 text-white mx-auto mb-2' strokeWidth={2} />
                                    <p className='text-white font-semibold text-sm'>Voir les détails</p>
                                </div>
                            </div>

                            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
                                <Folder className="w-40 h-40 text-amber-700 opacity-30" strokeWidth={1.5} />
                            </div>

                            <div className='relative z-10 h-full flex flex-col p-6'>

                    
                                <div className='absolute top-4 right-6 text-[12px] bg-[#e1bcbc] text-black px-2 py-1 border-black border-2 font-medium rounded'>
                                    {item.promotionName || 'N/A'}
                                </div>

                                <button
                                    onClick={() => setSelectedProjectId(item.id)}
                                    className='absolute top-4 left-6 cursor-pointer z-20 bg-black/50 rounded-full p-1 hover:bg-black/70'
                                >
                                    {/* <Image src={dots} alt="Options" className='size-5' /> */}
                                </button>

                                <div className='flex-1'></div>

                                <div className='flex flex-col items-center text-center mb-4'>
                                    <p className='text-gray-300 text-sm mb-1'>
                                        {item.adaProjectsName}
                                    </p>
                                    {item.createdAt && (
                                        <p className='text-gray-400 text-xs'>
                                            Le {FormatDate(item.createdAt)}
                                        </p>
                                    )}
                                </div>

                                
                                <div className='flex-1'></div>


                                <h2 className='text-white text-base font-bold text-center mb-3'>
                                    {item.title}
                                </h2>

                                <div className='flex gap-2'>
                                    {item.githubUrl && (
                                        <a
                                            href={item.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded transition flex items-center justify-center gap-2'
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Github className='w-4 h-4' />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {item.demoUrl && (
                                        <a
                                            href={item.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='flex-1 bg-amber-700 hover:bg-amber-600 text-white text-xs py-2 px-3 rounded transition flex items-center justify-center gap-2'
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Eye className='w-4 h-4' />
                                            <span>Démo</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {selectedProjectId === item.id && (
                                <EditProjectsCards
                                    closeEdit={() => setSelectedProjectId(null)}
                                    projectId={item.id}
                                    onDelete={onProjectDeleted}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    )
}