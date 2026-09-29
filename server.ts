import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// High body limit for base64 camera image uploads
app.use(express.json({ limit: '15mb' }));

// In-memory store for real-time ESP32 IoT telemetry updates
const binTelemetryOverrides: Record<string, any> = {};

// Helper: Gemini AI Client initialization (only used server-side)
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * AI Waste Classifier Endpoint
 * Uses gemini-3.8-flash with structured JSON output schema
 */
app.post('/api/ai/classify', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, description } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        success: false,
        fallbackRequired: true,
        message: 'No GEMINI_API_KEY configured on server; using local heuristic classifier.'
      });
    }

    const contents: any[] = [];
    let promptText = `You are a Smart City Waste Classification & Segregation Expert for Smart India Hackathon.
Analyze this waste item image carefully. Classify the item into one of the following exact categories:
['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-waste', 'Hazardous', 'Other'].
Determine the recommended disposal bin (Wet/Organic, Dry/Recyclable, Hazardous/E-Waste, General Landfill), safe handling advice, decomposition time estimate, and carbon footprint reduction potential.`;

    if (description) {
      promptText += ` Additional contextual hint from user: "${description}".`;
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    contents.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItem: {
              type: Type.STRING,
              description: 'The specific item identified (e.g. PET Mineral Water Bottle, Banana Peel, Aluminum Soda Can).'
            },
            category: {
              type: Type.STRING,
              description: 'One of Organic, Plastic, Paper, Glass, Metal, E-waste, Hazardous, Other.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence percentage between 80 and 99.'
            },
            recommendedBin: {
              type: Type.STRING,
              description: 'Clear bin instruction, e.g. "Dry / Recyclable Waste (Blue Bin)".'
            },
            binColor: {
              type: Type.STRING,
              description: 'Hex color code for the bin, e.g. #2563EB for blue, #16A34A for green, #DC2626 for red.'
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief material and scientific explanation.'
            },
            safeHandlingAdvice: {
              type: Type.STRING,
              description: 'Actionable instructions before throwing (e.g. rinse, crush, isolate).'
            },
            decompositionTime: {
              type: Type.STRING,
              description: 'Estimated environmental degradation timeline.'
            },
            recyclable: {
              type: Type.BOOLEAN,
              description: 'Whether this item is industrially recyclable.'
            },
            carbonFootprintReductionKg: {
              type: Type.NUMBER,
              description: 'Kg of CO2 saved by segregating instead of landfilling.'
            }
          },
          required: [
            'detectedItem', 
            'category', 
            'confidence', 
            'recommendedBin', 
            'binColor', 
            'explanation', 
            'safeHandlingAdvice', 
            'decompositionTime', 
            'recyclable',
            'carbonFootprintReductionKg'
          ]
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      result: parsedJson
    });
  } catch (error: any) {
    console.error('Gemini Classification API error:', error?.message || error);
    return res.status(200).json({
      success: false,
      fallbackRequired: true,
      error: error?.message || 'Server-side AI processing fallback'
    });
  }
});

/**
 * REST Endpoint for ESP32 / IoT Hardware Nodes
 * Hardware transmits: { fillLevel, temperature, humidity, gasPpm, batteryLevel, lidStatus }
 */
app.post('/api/iot/bin/:id/telemetry', (req: Request, res: Response) => {
  const { id } = req.params;
  const { fillLevel, temperature, humidity, gasPpm, batteryLevel, lidStatus } = req.body;

  binTelemetryOverrides[id] = {
    fillLevel: typeof fillLevel === 'number' ? fillLevel : undefined,
    temperature: typeof temperature === 'number' ? temperature : undefined,
    humidity: typeof humidity === 'number' ? humidity : undefined,
    gasPpm: typeof gasPpm === 'number' ? gasPpm : undefined,
    batteryLevel: typeof batteryLevel === 'number' ? batteryLevel : undefined,
    lidStatus: lidStatus || 'closed',
    lastUpdated: 'Just now (ESP32 Live)',
    timestamp: new Date().toISOString()
  };

  return res.json({
    status: 'ACK',
    binId: id,
    message: 'Telemetry successfully received and ingested into Decision Engine.',
    serverTime: new Date().toISOString()
  });
});

/**
 * Get live hardware telemetry overrides
 */
app.get('/api/iot/telemetry', (_req: Request, res: Response) => {
  res.json({
    telemetry: binTelemetryOverrides
  });
});

/**
 * Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    app: 'EcoSanctuary Smart Waste Management & Sanitization',
    version: 'SIH26212-v1.0',
    geminiEnabled: !!aiClient
  });
});

// Vite middleware in dev or static dist in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[EcoSanctuary Server] Running on http://0.0.0.0:${port}`);
  });
}

startServer();
