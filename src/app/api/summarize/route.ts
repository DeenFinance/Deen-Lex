import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided to summarize' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert legal assistant. Read the following case law and provide a structured summary. Include the Core Facts, The Main Legal Issue, and the Court's Decision (Ratio Decidendi). Keep it clear and professional.\n\nCase Text:\n${text}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
