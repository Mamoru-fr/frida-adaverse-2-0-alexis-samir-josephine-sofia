import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = response.choices[0].message.content;
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json(
            { error: 'Error communicating with OpenAI' },
            { status: 500 }
        );
    }
}
