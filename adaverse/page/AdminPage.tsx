'use client';
import {User} from '@/content/interface';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Users} from 'lucide-react';

export default function AdminPage({session}: {session: any}) {
	const [users, setUsers] = useState<User[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const router = useRouter();

	const fetchData = async (endpoint: string, setter: (data: any) => void, method: string = 'GET', bodyJson?: any) => {
		try {
			const options: RequestInit = {
				method,
				headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : undefined,
				body: bodyJson ? JSON.stringify(bodyJson) : undefined,
			};
			const res = await fetch(endpoint, options);
			if (!res.ok) {
				throw new Error('Erreur lors de la requête');
			}
			const data = await res.json();
			setter(data);
		} catch (error) {
			console.error(`Erreur lors de la requête à ${endpoint}:`, error);
			throw error;
		}
	};

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			await fetchData('/api/users', setUsers);
		} catch (error) {
			// Error already logged
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleBanToggle = async (userId: string, currentBanned: boolean) => {
		setUpdatingUserId(userId);
		try {
			const newBannedStatus = !currentBanned;
			await fetchData(`/api/users/${userId}`, () => {}, 'PATCH', { banned: newBannedStatus });
			await fetchUsers();
		} catch (error) {
			alert('Erreur lors de la mise à jour du statut');
		} finally {
			setUpdatingUserId(null);
		}
	};

	const renderHeader = () => (
		<div className="p-1 md:p-2 m-1 md:m-2 rounded-xl relative z-10">
			<div className="flex flex-wrap gap-2 md:gap-4 items-center bg-gray-500 p-2 md:p-3 rounded-xl shadow-md">
				<h1 className="font-bold text-[#f3d5d5] text-xl md:text-2xl cursor-pointer" onClick={() => router.push('/')}>
					ada<span>VERSE</span>
				</h1>
				<div className="flex-1 min-w-0"></div>
				<button
					onClick={() => router.push('/')}
					className="p-2 px-3 md:px-4 cursor-pointer bg-amber-700 text-white rounded hover:bg-amber-800 transition font-medium text-xs md:text-sm whitespace-nowrap"
				>
					<span className="hidden sm:inline">RETOUR À L'ACCUEIL</span>
					<span className="sm:hidden">RETOUR</span>
				</button>
			</div>
		</div>
	);

	const renderStatusBadge = (user: User) => {
		if (user.role === 'admin') {
			return (
				<button
					className="bg-amber-700 text-white px-2 md:px-4 py-1 rounded-full font-semibold text-xs md:text-sm cursor-not-allowed"
					disabled
				>
					<span className="hidden md:inline">Impossible à bannir</span>
					<span className="md:hidden">Admin</span>
				</button>
			);
		}

		return (
			<button
				className={`px-2 md:px-4 py-1 rounded-full font-semibold text-xs md:text-sm shadow transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
					user.banned
						? 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-400/60'
						: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-400/60'
				}`}
				onClick={() => handleBanToggle(user.id, user.banned)}
				disabled={updatingUserId === user.id}
			>
				{updatingUserId === user.id ? (
					<span>⏳</span>
				) : (
					<>
						<span className="hidden md:inline">
							{user.banned ? 'Débannir' : 'Bannir'}
						</span>
						<span className="md:hidden">
							{user.banned ? '✓' : '🚫'}
						</span>
					</>
				)}
			</button>
		);
	};

	if (!session || session.user.role !== 'admin') {
		return null;
	}

	return (
		<div className="min-h-screen flex flex-col relative">
			{/* Header */}
			{renderHeader()}

			{/* Main Content */}
			<main className="flex-1 p-1 md:p-2 m-1 md:m-2 relative z-10">
				<div className="max-w-7xl mx-auto">
					<div className="bg-gray-500/95 backdrop-blur-md rounded-xl p-3 md:p-6 shadow-md mb-4 md:mb-6">
						<div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
							<Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
							<h1 className="text-[#f3d5d5] text-xl md:text-2xl lg:text-3xl font-bold">Liste des utilisateurs</h1>
						</div>

						{isLoading ? (
							<p className="text-gray-400 text-center py-8 text-sm md:text-base">Chargement des utilisateurs...</p>
						) : (
							<div className="overflow-x-auto -mx-3 md:mx-0">
								<table className="w-full text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-400">
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">Nom</th>
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm hidden sm:table-cell">Email</th>
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">Rôle</th>
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm hidden lg:table-cell">Banni</th>
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm hidden md:table-cell">Créé le</th>
											<th className="text-left text-white font-semibold py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">Statut</th>
										</tr>
									</thead>
									<tbody>
										{users && users.map((user, index) => (
											<tr
												key={user.id}
												className={`border-b border-gray-400/50 hover:bg-gray-400/20 transition ${index % 2 === 0 ? 'bg-black/10' : ''
													}`}
											>
												<td className="py-2 md:py-3 px-2 md:px-4 text-gray-200 text-xs md:text-sm">{user.name}</td>
												<td className="py-2 md:py-3 px-2 md:px-4 text-gray-200 text-xs md:text-sm hidden sm:table-cell">{user.email}</td>
												<td className="py-2 md:py-3 px-2 md:px-4">
													<span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${user.role === 'admin'
															? 'bg-amber-700 text-white'
															: 'bg-gray-600 text-gray-200'
														}`}>
														{user.role}
													</span>
												</td>
												<td className="py-2 md:py-3 px-2 md:px-4 hidden lg:table-cell">
												<span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
													user.banned
														? 'bg-red-600 text-white'
														: 'bg-green-600 text-white'
												}`}>
													{user.banned ? 'Oui' : 'Non'}
													</span>
												</td>
												<td className="py-2 md:py-3 px-2 md:px-4 text-gray-200 text-xs md:text-sm hidden md:table-cell">
													{new Date(user.createdAt).toLocaleString('fr-FR')}
												</td>
												<td className="py-2 md:py-3 px-2 md:px-4">
													{renderStatusBadge(user)}
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
