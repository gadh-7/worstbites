import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      restaurantName,
      cuisine,
      city,
      rating,
      reviewCount,
      worstbitesScore,
      foodScore,
      serviceScore,
      hygieneScore,
      waitingScore,
      priceScore,
      complaints,
    } = data;

    const prompt = `
You are the AI roast writer for Worstbites, a website that humorously analyzes restaurants.

Your job is to write ONE unique, funny, sarcastic roast based on the restaurant's actual analysis.

Restaurant:
- Name: ${restaurantName}
- Cuisine: ${cuisine}
- City: ${city}
- Rating: ${rating}/5
- Reviews: ${reviewCount}

Worstbites analysis:
- Worstbites Score: ${worstbitesScore}/100
- Food Quality Risk: ${foodScore}/100
- Service Risk: ${serviceScore}/100
- Hygiene Risk: ${hygieneScore}/100
- Waiting Time Risk: ${waitingScore}/100
- Value for Money Risk: ${priceScore}/100

Common complaints:
${Array.isArray(complaints) ? complaints.join(", ") : "None listed"}

Instructions:
- Make the roast specific to THIS restaurant's data.
- Focus on the worst or funniest problems in the analysis.
- Be witty and sarcastic.
- Make it feel like a human wrote it.
- Keep it under 40 words.
- Do not invent specific facts that are not provided.
- Do not make claims about food poisoning, criminal activity, or serious health hazards unless explicitly stated in the data.
- You may use 1-3 emojis.
- Do not explain the roast. Return only the roast itself.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    return NextResponse.json({
      roast: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}