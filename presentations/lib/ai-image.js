import { writeFileSync } from 'fs';
import { extname } from 'path';

const POLLINATIONS_API = 'https://image.pollinations.ai';

export async function generateImage(prompt, outputFile = 'generated-image.png') {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
  
  const sanitizedPrompt = prompt.trim();
  const outputPath = outputFile || `generated-${Date.now()}.png`;
  const extension = extname(outputPath).toLowerCase() || '.png';
  
  const apiKey = process.env.NANO_BANANA_API_KEY;
  
  if (apiKey) {
    try {
      const result = await generateWithNanoBanana(apiKey, sanitizedPrompt, outputPath);
      return result;
    } catch (e) {
      console.warn(`Nano Banana failed: ${e.message}`);
      console.warn('Falling back to free generation...');
    }
  }
  
  return generateFreeImage(sanitizedPrompt, outputPath);
}

async function generateWithNanoBanana(apiKey, prompt, outputPath) {
  const apiUrl = 'https://api.nanobanana.io/v1/generate';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt,
      width: 1920,
      height: 1080,
      style: 'presentation',
      quality: 'high'
    })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const buffer = await response.arrayBuffer();
  writeFileSync(outputPath, Buffer.from(buffer));
  
  return outputPath;
}

async function generateFreeImage(prompt, outputPath) {
  console.log('Using Pollinations.ai (free, no API key required)...');
  
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `${POLLINATIONS_API}/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Pollinations fetch failed: ${response.status}`);
  }
  
  const buffer = await response.arrayBuffer();
  writeFileSync(outputPath, Buffer.from(buffer));
  
  return outputPath;
}

export async function generateThumbnail(prompt, outputPath) {
  const thumbPrompt = `${prompt}, thumbnail, simplified`;
  return generateImage(thumbPrompt, outputPath);
}

export async function generateBackground(prompt, outputPath) {
  const bgPrompt = `${prompt}, background, abstract, presentation slide`;
  return generateImage(bgPrompt, outputPath);
}

export function getFreeAlternatives() {
  return [
    {
      name: 'Pollinations.ai',
      url: 'https://pollinations.ai',
      api: POLLINATIONS_API,
      cost: 'Free',
      quality: 'Good',
      requiresKey: false
    },
    {
      name: 'Hugging Face',
      url: 'https://huggingface.co/diffusers',
      cost: 'Free tier',
      quality: 'Variable',
      requiresKey: false
    },
    {
      name: 'DreamStudio',
      url: 'https://dreamstudio.ai',
      cost: 'Free credits',
      quality: 'Excellent',
      requiresKey: true
    },
    {
      name: 'Leonardo.ai',
      url: 'https://leonardo.ai',
      cost: 'Free tier',
      quality: 'Excellent',
      requiresKey: true
    }
  ];
}