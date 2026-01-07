
import React, {useState, useRef, useEffect} from 'react';
import {MessageCircle, X, Send} from 'lucide-react';
import {ConversationSchema} from '@/lib/chatbot/schemas';
import {SITE_CONTEXT} from '@/lib/chatbot/context';
import {Projects} from '@/content/interface';

type Message = {
	role: 'user' | 'assistant';
	content: string;
};

function validateConversation(messages: unknown) {
	try {
		const conversation = ConversationSchema.parse(messages);
		console.log("Conversation valide :", conversation);
		return conversation;
	} catch (error) {
		console.error("Erreur de validation :", error);
		throw new Error("La structure de la conversation est invalide.");
	}
}

const Chatbox = ({projects = [], author, projectType, promotions}: {projects?: Projects[], author?: string, projectType?: string, promotions?: string}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll automatique vers le bas quand les messages changent
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;
		const newMessage: Message = {role: 'user', content: input};
		setMessages([...messages, newMessage]);
		setInput('');

		try {
			// Créer le contexte avec les informations des projets
			let contextWithProjects = SITE_CONTEXT;

			if (projects.length === 1) {
				// Cas d'un seul projet (page de détails)
				const p = projects[0];
				const projectInfo = `
## CE PROJET actuellement affiché :
- Titre : "${p.title}"
- GitHub : ${p.githubUrl}
- Démo : ${p.demoUrl || 'Non disponible'}
- Auteur : ${author || 'Inconnu'}
- Type de Projet : ${projectType || 'Inconnu'}
- Promotions des Créateurs : ${promotions || 'Inconnue'}
- Date de création : ${new Date(p.createdAt).toLocaleDateString('fr-FR')}
- Date de publication : ${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('fr-FR') : 'Non publié'}

Quand l'utilisateur parle de "ce projet" ou "le projet", il fait référence à ces informations. Réponds avec les détails disponibles ci-dessus. N'invente JAMAIS d'informations qui ne sont pas dans cette liste.`;

				contextWithProjects += projectInfo;
			} else if (projects.length > 1) {
				// Cas de plusieurs projets (page d'accueil)
				const projectsList = projects.map(p => {
					const createdDate = new Date(p.createdAt).toLocaleDateString('fr-FR');
					return `- "${p.title}" (créé le ${createdDate}, GitHub: ${p.githubUrl}${p.demoUrl ? ', Démo: ' + p.demoUrl : ''})`;
				}).join('\n');

				contextWithProjects += `\n\n## Projets créés par les utilisateurs actuellement dans la base de données :\n${projectsList}\n\nCe sont les projets créés par les étudiants et membres de la communauté Ada. Quand un utilisateur demande "quels projets sont disponibles" ou "montre-moi les projets", tu parles de cette liste. Guide l'utilisateur en donnant des instructions textuelles, JAMAIS de liens.`;
			}

			// Ajouter le message système avec le contexte du site
			const systemMessage = {role: 'system', content: contextWithProjects};
			const conversationWithContext = [systemMessage, ...messages, newMessage];

			const response = await fetch('/api/mistral', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({messages: conversationWithContext}),
			});

			const data = await response.json();

			if (!response.ok) {
				console.error('API Error:', data);
				
				// Erreurs à afficher à l'utilisateur
				let errorMessage = "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.";
				
				// Erreur de clé API ou problème serveur -> message générique (ne pas exposer les détails)
				if (data.error?.includes('apiKey') || data.error?.includes('credentials')) {
					errorMessage = "Le service est temporairement indisponible. Veuillez réessayer plus tard.";
				}
				// Erreur réseau ou timeout -> message spécifique
				else if (response.status >= 500) {
					errorMessage = "Le serveur ne répond pas. Veuillez réessayer dans quelques instants.";
				}
				// Erreur de quota ou rate limit
				else if (response.status === 429) {
					errorMessage = "Trop de demandes. Veuillez patienter un moment avant de réessayer.";
				}
				
				// Afficher l'erreur dans le chat
				const errorAiMessage: Message = {
					role: 'assistant',
					content: errorMessage
				};
				setMessages((prevMessages) => [...prevMessages, errorAiMessage]);
				return;
			}

			const aiMessage = data;
			setMessages((prevMessages) => {
				const validatedMessages = validateConversation([...prevMessages, aiMessage]);
				return validatedMessages;
			});
		} catch (error) {
			console.error("Erreur lors de l'obtention de la réponse de l'IA :", error);
			
			// Afficher un message d'erreur générique dans le chat pour les erreurs inattendues
			const errorAiMessage: Message = {
				role: 'assistant',
				content: "Une erreur inattendue s'est produite. Veuillez vérifier votre connexion internet et réessayer."
			};
			setMessages((prevMessages) => [...prevMessages, errorAiMessage]);
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{/* Chat Button */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					aria-label="Ouvrir le chat"
				>
					<MessageCircle size={24} />
				</button>
			)}

			{/* Chat Window */}
			{isOpen && (
				<div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 flex flex-col max-h-[50vh]">
					{/* Header */}
					<div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
						<h3 className="font-semibold flex items-center gap-2">
							<MessageCircle size={20} />
							Discussion
						</h3>
						<button
							onClick={() => setIsOpen(false)}
							className="hover:bg-indigo-700 rounded-full p-1 transition-colors focus:outline-none"
							aria-label="Fermer le chat"
						>
							<X size={20} />
						</button>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[200px] max-h-[300px] md:max-h-[800px]">
						{messages.length === 0 && (
							<div className="text-gray-400 text-center text-sm">
								Commence la conversation…
							</div>
						)}
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[80%] px-4 py-2 rounded-2xl wrap-break-words overflow-wrap-anywhere ${msg.role === 'user'
										? 'bg-indigo-600 text-white'
										: 'bg-white text-gray-800 border border-gray-200'
									}`}
								>
									{msg.content}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className="p-4 border-t border-gray-200 bg-white text-black rounded-b-lg">
						<div className="flex gap-2">
							<input
								type="text"
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={e => {if (e.key === 'Enter') handleSend();}}
								placeholder="Écris un message…"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<button
								onClick={handleSend}
								className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-1"
								aria-label="Envoyer"
							>
								<Send size={18} />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chatbox;