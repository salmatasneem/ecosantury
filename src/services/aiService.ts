import { WasteClassificationResult } from '../types';
import { classifyWaste } from './decisionEngine';

export interface DemoWasteSample {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  thumbnailSvg: string;
  defaultDescriptor: string;
}

export const DEMO_WASTE_SAMPLES: DemoWasteSample[] = [
  {
    id: 'sample-plastic-bottle',
    name: 'Plastic Water Bottle',
    category: 'Plastic',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'bottle',
    defaultDescriptor: 'Clear transparent plastic mineral water bottle made of PET 1 polymer with blue screw cap.'
  },
  {
    id: 'sample-banana-peel',
    name: 'Banana Peel / Bio-Waste',
    category: 'Organic',
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'apple',
    defaultDescriptor: 'Fresh organic ripe banana peel and fruit kitchen food scrap.'
  },
  {
    id: 'sample-soda-can',
    name: 'Aluminum Soda Can',
    category: 'Metal',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'cylinder',
    defaultDescriptor: 'Crushed aluminum soda drink beverage can.'
  },
  {
    id: 'sample-cardboard',
    name: 'Corrugated Cardboard Box',
    category: 'Paper',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'box',
    defaultDescriptor: 'Brown corrugated shipping packaging carton box.'
  },
  {
    id: 'sample-glass-jar',
    name: 'Glass Jam Jar',
    category: 'Glass',
    imageUrl: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'flask',
    defaultDescriptor: 'Clear glass food preserve jam jar with metal lid.'
  },
  {
    id: 'sample-e-waste',
    name: 'Li-Ion Battery & Cable',
    category: 'E-waste',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'battery',
    defaultDescriptor: 'Used lithium-ion mobile battery and damaged copper charging cable.'
  }
];

export async function classifyWasteImage(
  imageBase64?: string,
  mimeType?: string,
  textHint?: string
): Promise<WasteClassificationResult> {
  // Try server-side Gemini 3.8 Flash Vision API
  try {
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        mimeType: mimeType || 'image/jpeg',
        description: textHint || ''
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.result) {
        return {
          ...data.result,
          sourceImageUrl: imageBase64
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API not reachable; falling back to local AI heuristic engine.', err);
  }

  // Graceful fallback to local AI classification heuristic
  const fallback = classifyWaste(textHint || 'plastic bottle');
  return {
    ...fallback,
    sourceImageUrl: imageBase64
  };
}
