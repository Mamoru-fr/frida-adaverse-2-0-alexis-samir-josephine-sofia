'use client';
import {User} from '@/content/interface';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdminPage() {
	const [users, setUsers] = useState<User[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);
			try {
				const res = await fetch('/api/users');
				if (!res.ok) {
					throw new Error('Erreur lors de la récupération des utilisateurs');
				}
				const data = await res.json();
				setUsers(data);
			} catch (error) {
				console.error('Erreur:', error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchUsers();
	}, []);

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

			{/* Main Content */}
			<main className="flex-1 p-2 m-2 relative z-10">
				<div className="max-w-7xl mx-auto">
					<div className="bg-gray-500/95 backdrop-blur-md rounded-xl p-6 shadow-md mb-6">
						<div className="flex items-center gap-3 mb-4">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
							<h1 className="text-[#f3d5d5] text-3xl font-bold">Liste des utilisateurs</h1>
						</div>

						{isLoading ? (
							<p className="text-gray-400 text-center py-8">Chargement des utilisateurs...</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-400">
											<th className="text-left text-white font-semibold py-3 px-4">Nom</th>
											<th className="text-left text-white font-semibold py-3 px-4">Email</th>
											<th className="text-left text-white font-semibold py-3 px-4">Rôle</th>
											<th className="text-left text-white font-semibold py-3 px-4">Banni</th>
											<th className="text-left text-white font-semibold py-3 px-4">Créé le</th>
											
										</tr>
									</thead>
									<tbody>
										{users && users.map((user, index) => (
											<tr 
												key={user.id} 
												className={`border-b border-gray-400/50 hover:bg-gray-400/20 transition ${
													index % 2 === 0 ? 'bg-black/10' : ''
												}`}
											>
												<td className="py-3 px-4 text-gray-200">{user.name}</td>
												<td className="py-3 px-4 text-gray-200">{user.email}</td>
												<td className="py-3 px-4">
													<span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
														user.role === 'admin' 
															? 'bg-amber-700 text-white' 
															: 'bg-gray-600 text-gray-200'
													}`}>
														{user.role}
													</span>
												</td>
												<td className="py-3 px-4">
													<span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
														user.banni === 'true' || user.banni === '1'
															? 'bg-red-600 text-white' 
															: 'bg-green-600 text-white'
													}`}>
														{user.banni === 'true' || user.banni === '1' ? 'Oui' : 'Non'}
													</span>
												</td>
												<td className="py-3 px-4 text-gray-200">
													{new Date(user.createdAt).toLocaleString('fr-FR')}
													
												</td>
												<td className="py-3 px-4">
													
												<button>Actif</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
