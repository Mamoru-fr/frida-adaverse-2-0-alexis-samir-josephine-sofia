import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';


type Message = {
	role: 'user' | 'assistant';
	content: string;
};

const Chatbox = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const handleSend = () => {
		if (!input.trim()) return;
		const newMessage: Message = { role: 'user', content: input };
		setMessages([...messages, newMessage]);
		setInput('');
		// Ici, tu pourras ajouter l'appel à l'API ou la logique IA plus tard
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
				<div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 flex flex-col max-h-[500px] md:max-h-[1000px]">
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
									className={`max-w-[80%] px-4 py-2 rounded-2xl wrap-break-words ${
										msg.role === 'user'
											? 'bg-indigo-600 text-white'
											: 'bg-white text-gray-800 border border-gray-200'
									}`}
								>
									{msg.content}
								</div>
							</div>
						))}
					</div>

					{/* Input */}
					<div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
						<div className="flex gap-2">
							<input
								type="text"
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
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
