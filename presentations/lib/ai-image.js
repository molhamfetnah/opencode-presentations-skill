import { writeFileSync } from 'fs';

const NANO_BANANA_API = 'https://api.nanobanana.io/v1/generate';

export async function generateImage(prompt, outputFile = 'generated.png') {
  const apiKey = process.env.NANO_BANANA_API_KEY;
  
  if (!apiKey) {
    console.log('\n⚠️  Nano Banana API key not set');
    console.log('   Set it with: export NANO_BANANA_API_KEY=your_key');
    console.log('   Or use free alternatives:\n');
    console.log('   - https://pollinations.ai/ (free, no key)');
    console.log('   - https://dreamstudio.ai/ (free tier)');
    console.log('');
    console.log('   For free image generation, use:');
    console.log('   present ai-image "prompt" --free\n');
    
    return generateFreeImage(prompt, outputFile);
  }
  
  try {
    const response = await fetch(NANO_BANANA_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        width: 1920,
        height: 1080,
        style: 'presentation'
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    writeFileSync(outputFile, Buffer.from(buffer));
    
    console.log(`✅ Image saved to: ${outputFile}`);
    return outputFile;
  } catch (e) {
    console.log(`API error: ${e.message}, falling back to free generation`);
    return generateFreeImage(prompt, outputFile);
  }
}

async function generateFreeImage(prompt, outputFile) {
  console.log('🖼️  Using Pollinations.ai (free, no API key required)...');
  
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Pollinations fetch failed');
    
    const buffer = await response.arrayBuffer();
    writeFileSync(outputFile, Buffer.from(buffer));
    
    console.log(`✅ Free image saved to: ${outputFile}`);
    return outputFile;
  } catch (e) {
    console.log('⚠️  Could not generate image automatically.');
    console.log(`   Please visit: ${url}`);
    console.log(`   Save the image and use it manually in your presentation.`);
    return null;
  }
}

export function listFreeAlternatives() {
  return [
    { name: 'Pollinations.ai', url: 'https://pollinations.ai', cost: 'Free' },
    { name: 'Hugging Face', url: 'https://huggingface.co/diffusers', cost: 'Free' },
    { name: 'DreamStudio', url: 'https://dreamstudio.ai', cost: 'Free tier' },
    { name: 'Leonardo.ai', url: 'https://leonardo.ai', cost: 'Free tier' }
  ];
}