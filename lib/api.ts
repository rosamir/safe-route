import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export interface AlertHistoryNode {
  settlement: string;
  estimatedTime: string;
  alertsAtTime: number;
  alertsBefore: number;
  alertsAfter: number;
}

export interface RouteOption {
  id: string;
  name: string;
  duration: number; // minutes
  distance: number; // km
  safetyScore: number; // 0-100
  rationale: string;
  coordinates: [number, number][]; // [lat, lng]
  instructions: string[];
  alertHistory: AlertHistoryNode[];
}

async function geocode(address: string): Promise<[number, number]> {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Israel')}&format=json&limit=1`);
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  throw new Error(`Could not find location for: ${address}`);
}

export async function generateRouteAlternatives(
  origin: string,
  destination: string,
  arrivalDate: string,
  arrivalTime: string
): Promise<RouteOption[]> {
  try {
    const startCoords = await geocode(origin);
    const endCoords = await geocode(destination);

    // Fetch routes from OSRM with steps to get some street names
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?alternatives=true&overview=full&geometries=geojson&steps=true`;
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      throw new Error('No routes found');
    }

    const routesInfo = osrmData.routes.map((route: any, index: number) => {
      // Extract some key waypoints/streets from steps to help Gemini identify the route
      const streets = route.legs[0].steps
        .map((step: any) => step.name)
        .filter((name: string) => name && name.length > 0);
      const uniqueStreets = Array.from(new Set(streets)).slice(0, 10); // Take up to 10 main streets/roads

      return {
        id: `route-${index}`,
        distance: Math.round(route.distance / 1000), // km
        duration: Math.round(route.duration / 60), // minutes
        coordinates: route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]), // Leaflet expects [lat, lng]
        keyRoads: uniqueStreets.join(', ')
      };
    });

    const dayOfWeek = new Date(arrivalDate).toLocaleDateString('he-IL', { weekday: 'long' });

    // Now ask Gemini to evaluate these routes based on the current situation "Lion's Roar"
    const prompt = `
      You are an AI routing assistant for "Safe-Route" (נתיב בטוח) in Israel during operation "Lion's Roar" (שאגת הארי).
      The user wants to travel from "${origin}" to "${destination}" arriving on ${arrivalDate} (${dayOfWeek}) around ${arrivalTime}.
      
      I have found ${routesInfo.length} possible routes:
      ${routesInfo.map((r: any, i: number) => `Route ${i + 1}: Distance ${r.distance}km, Duration ${r.duration}mins. Key roads: ${r.keyRoads}`).join('\n')}
      
      For each route, you must:
      1. Identify the main cities/areas it passes through based on the origin, destination, and key roads.
      2. Simulate checking the alert history for these specific cities on ${dayOfWeek}s around ${arrivalTime}. 
      3. Calculate a safety score (0-100) based on this simulated history. A route passing through cities with fewer alerts at this specific time/day should get a higher score.
      4. Provide a descriptive name in Hebrew (e.g., "דרך כביש 6", "דרך כביש החוף").
      5. Provide a DETAILED rationale in Hebrew explaining the safety score. You MUST mention the specific cities on the way, their simulated alert history for ${dayOfWeek} at ${arrivalTime}, and why this route is safer or riskier compared to others.
      6. Provide a list of 3-5 main driving directions (הוראות הגעה) in Hebrew for this route.
      7. Provide a simulated 'alertHistory' array representing the journey. For each main settlement along the route, provide:
         - "settlement": The name of the city/town in Hebrew.
         - "estimatedTime": The estimated time passing through this settlement (e.g., "10:15", calculated backwards from the arrival time ${arrivalTime} based on the route duration).
         - "alertsAtTime": Simulated number of historical alerts exactly at this time.
         - "alertsBefore": Simulated number of historical alerts in the 15 minutes before.
         - "alertsAfter": Simulated number of historical alerts in the 15 minutes after.
      
      Return the result strictly as a JSON array of objects with the following keys:
      "name", "safetyScore", "rationale", "instructions" (array of strings), "alertHistory" (array of objects with keys: "settlement", "estimatedTime", "alertsAtTime", "alertsBefore", "alertsAfter").
      The array must have exactly ${routesInfo.length} items, corresponding to the routes above in order.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview', // Use pro for better reasoning and detailed explanations
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from AI');
    
    const parsed = JSON.parse(text);
    
    return routesInfo.map((route: any, index: number) => ({
      ...route,
      name: parsed[index]?.name || `מסלול ${index + 1}`,
      safetyScore: parsed[index]?.safetyScore || 80,
      rationale: parsed[index]?.rationale || 'מסלול זה נבחר על בסיס נתוני תנועה.',
      instructions: parsed[index]?.instructions || ['סע בזהירות ליעד.'],
      alertHistory: parsed[index]?.alertHistory || [],
    }));
  } catch (error) {
    console.error('Error generating routes:', error);
    throw error;
  }
}
