import { z } from 'zod';

// Schéma pour un message utilisateur
export const UserMessageSchema = z.object({
  role: z.literal('user'),
  content: z.string().min(1, "Le message ne peut pas être vide"),
});

// Schéma pour un message de l'IA
export const AIMessageSchema = z.object({
  role: z.literal('assistant'),
  content: z.string().min(1, "La réponse de l'IA ne peut pas être vide"),
});

// Schéma pour une conversation (liste de messages)
export const ConversationSchema = z.array(
  z.discriminatedUnion('role', [UserMessageSchema, AIMessageSchema])
);

// TypeScript types dérivés des schémas Zod
// export type UserMessage = z.infer<typeof UserMessageSchema>;
// export type AIMessage = z.infer<typeof AIMessageSchema>;
// export type Conversation = z.infer<typeof ConversationSchema>;
