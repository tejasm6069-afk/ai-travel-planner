import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { destination, budget, days } = await req.json();

    // We explicitly define the JSON blueprint in the prompt so Groq knows exactly how to format the data
    const prompt = `
      You are an expert travel planner. Create a ${days}-day itinerary for ${destination} on a ${budget} budget.
      Return ONLY a valid JSON object matching this exact structure:
      {
        "destination": "${destination}",
        "budget": "${budget}",
        "itinerary": [
          {
            "day": 1,
            "theme": "A short theme for the day",
            "activities": [
              {
                "timeOfDay": "Morning",
                "placeName": "Exact name of location for Google Maps",
                "description": "A 1-2 sentence description of what to do there",
                "estimatedCost": "Cost in local currency"
              }
            ]
          }
        ]
      }
    `;

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b', // A highly capable and fast model
      messages: [
        { 
          role: 'system', 
          content: 'You output logical, geographically optimized travel itineraries. You must respond in valid JSON format.' 
        },
        { 
          role: 'user', 
          content: prompt 
        },
      ],
      // This forces Groq to only output parsable JSON
      response_format: { type: 'json_object' }, 
    });

    // Parse the resulting string into a real JSON object for the frontend
    const tripData = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return NextResponse.json({ success: true, data: tripData });

  } catch (error) {
    console.error("Error generating trip with Groq:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate itinerary' }, 
      { status: 500 }
    );
  }
}