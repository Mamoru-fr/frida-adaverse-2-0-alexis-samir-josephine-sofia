import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const response = await mistral.chat.complete({
            model: 'mistral-small-latest',
            messages: messages,
        });

        const reply = response.choices?.[0]?.message?.content;
        
        if (!reply) {
            console.error('Mistral returned empty response');
            return NextResponse.json(
                { error: 'Mistral returned empty response' },
                { status: 500 }
            );
        }
        
        return NextResponse.json({ 
            role: 'assistant',
            content: reply 
        });
    } catch (error: any) {
        console.error('Mistral API error:', error);
        console.error('Error details:', error?.message, error?.response?.data);
        return NextResponse.json(
            { error: error?.message || 'Error communicating with Mistral' },
            { status: 500 }
        );
    }
}
