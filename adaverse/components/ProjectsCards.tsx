'use client'

import { useState } from 'react'
import { EditProjectsCards } from './EditProjectsCards'
import { FormatDate } from '@/utils/FormatDate'

interface CardsProps {
    form: any[];
    onProjectDeleted: () => void;
}

export default function ProjectsCards({ form, onProjectDeleted }: CardsProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

    return (
        <>
            <h1>Tous les projets ({form.length})</h1>
            <div className='flex flex-wrap gap-4'>
                {Array.isArray(form) && form.length === 0 ? (
                    <p className='text-gray-400'>Aucun projet pour le moment.</p>
                ) : (
                    Array.isArray(form) && form.map((item) => (
                        <div key={item.id} className='relative w-[280px] h-80'>

                            <div className='absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg'></div>

                            <div className='absolute top-10 left-15 flex items-center justify-center'>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 16 16"
                                    className="w-40 h-40 text-amber-700"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.828 4a3 3 0 01-2.12-.879l-.83-.828A1 1 0 006.173 2H2.5a1 1 0 00-1 .981L1.546 4h-1L.5 3a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 009.828 3v1z"></path>
                                    <path fillRule="evenodd" d="M13.81 4H2.19a1 1 0 00-.996 1.09l.637 7a1 1 0 00.995.91h10.348a1 1 0 00.995-.91l.637-7A1 1 0 0013.81 4zM2.19 3A2 2 0 00.198 5.181l.637 7A2 2 0 002.826 14h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0013.81 3H2.19z" clipRule="evenodd"></path>
                                </svg>
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
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 480 512"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path d="M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"></path>
                                            </svg>
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
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 512 512"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M256 105c-101.8 0-188.4 62.4-224 151 35.6 88.6 122.2 151 224 151s188.4-62.4 224-151c-35.6-88.6-122.2-151-224-151zm0 251.7c-56 0-101.8-45.3-101.8-100.7S200 155.3 256 155.3 357.8 200.6 357.8 256 312 356.7 256 356.7zm0-161.1c-33.6 0-61.1 27.2-61.1 60.4s27.5 60.4 61.1 60.4 61.1-27.2 61.1-60.4-27.5-60.4-61.1-60.4z"></path>
                                            </svg>
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