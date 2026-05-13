import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar AI en el servidor con el SDK oficial
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, base64Image, mimeType, prompt, medium } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY no configurada' }, { status: 500 });
    }

    // Usar el modelo flash para mayor velocidad y menor costo
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let finalPrompt = prompt;

    if (action === 'marketing' && medium) {
      switch (medium) {
        case 'mug':
          finalPrompt =
            'A professional product photo of this item printed on a white coffee mug, placed on a wooden table, realistic lighting, high quality, 4k.';
          break;
        case 'billboard':
          finalPrompt =
            'A professional photo of a city billboard displaying this product, urban environment, realistic lighting, high quality, 4k.';
          break;
        case 'tshirt':
          finalPrompt =
            'A professional photo of a person wearing a white t-shirt with this product printed on the front, studio lighting, high quality, 4k.';
          break;
      }
    }

    // Preparar las partes del mensaje multimodal
    const parts = [
      {
        inlineData: {
          data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image,
          mimeType: mimeType || 'image/png',
        },
      },
      {
        text: finalPrompt || 'Describe this food image',
      },
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('AI Proxy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error en el servidor de IA' },
      { status: 500 },
    );
  }
}
