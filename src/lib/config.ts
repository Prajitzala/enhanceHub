export const config = {
  // AI Services Configuration
  ai: {
    replicate: {
      enabled: !!process.env.REPLICATE_API_TOKEN,
      token: process.env.REPLICATE_API_TOKEN,
    },
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      token: process.env.OPENAI_API_KEY,
    },
    huggingface: {
      enabled: !!process.env.HUGGINGFACE_API_KEY,
      token: process.env.HUGGINGFACE_API_KEY,
    },
  },
  
  // Processing Options
  processing: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    maxTextLength: 100,
    timeout: 30000, // 30 seconds
  },
  
  // Model Configuration
  models: {
    objectDetection: {
      model: "ultralytics/yolov8:6b4aed0ca9495ff2d691f87563ed95a6f9f0dc065dde3126c5e7a0aabbac6b3a" as const,
      confidence: 0.25,
      iou: 0.45,
    },
    textGeneration: {
      model: "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf" as const,
      steps: 50,
      guidance: 7.5,
    },
    inpainting: {
      model: "stability-ai/stable-diffusion-2-inpainting:95fcc2a26d5c9b5112d3d7c851c3e3b8b4b8b8b8b4b8b8b8b4b8b8b8b4b8b8b8b" as const,
      steps: 50,
      guidance: 7.5,
    },
  },
}

export const getAIConfig = () => {
  const hasAnyAIToken = config.ai.replicate.enabled || 
                       config.ai.openai.enabled || 
                       config.ai.huggingface.enabled
  
  return {
    ...config,
    ai: {
      ...config.ai,
      enabled: hasAnyAIToken,
    }
  }
}
