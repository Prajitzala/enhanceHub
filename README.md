# AI Text Behind Image

A full-stack Next.js 14 application that allows users to upload images and place custom text behind the main objects using AI technology. The app features a modern, clean design similar to textbehindimage.com with drag-and-drop file upload, real-time preview, and seamless AI processing.

## Features

- 🎨 **Modern UI Design**: Clean, minimalistic design with glassmorphism effects
- 📁 **Drag & Drop Upload**: Easy image upload with drag-and-drop functionality
- ✍️ **Text Input**: Add custom text to place behind objects
- 🤖 **AI Processing**: Advanced AI technology to detect objects and place text behind them
- 📊 **Real-time Progress**: Visual progress indicator during processing
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔔 **Toast Notifications**: User-friendly notifications for success and error states
- 💾 **Download Functionality**: Download the processed images
- 🎯 **Object Detection**: AI-powered object detection for seamless text placement

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **File Upload**: react-dropzone
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **TypeScript**: Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-text-behind-image
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-text-behind-image/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── process/
│   │   │       └── route.ts          # API endpoint for image processing
│   │   ├── globals.css               # Global styles with shadcn/ui variables
│   │   ├── layout.tsx                # Root layout component
│   │   └── page.tsx                  # Main landing page
│   ├── components/
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── progress.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── file-uploader.tsx     # Custom file upload component
│   ├── hooks/
│   │   └── use-toast.ts              # Toast notification hook
│   └── lib/
│       └── utils.ts                  # Utility functions
├── components.json                   # shadcn/ui configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── package.json
```

## AI Integration

The app now includes full AI integration with Replicate! 🚀

### Quick Setup

1. **Get a Replicate API token** from [replicate.com](https://replicate.com)
2. **Create `.env.local`** file in the project root
3. **Add your token**: `REPLICATE_API_TOKEN=r8_your_token_here`
4. **Restart the server** and start processing!

### AI Processing Pipeline

The app uses a sophisticated AI pipeline:

1. **Object Detection** (YOLOv8) - Detects objects in your image
2. **Text Generation** (Stable Diffusion) - Creates text as an image
3. **Image Composition** - Places text behind detected objects
4. **Fallback Methods** - Multiple AI approaches for reliability

### Supported AI Services

- ✅ **Replicate** (Primary) - Stable Diffusion, YOLOv8
- 🔄 **OpenAI** (Optional) - GPT-4 Vision + DALL-E
- 🔄 **Hugging Face** (Optional) - Open-source models

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## API Integration

The app includes full AI integration in `/api/process`. The AI processing includes:

### Option 1: Replicate Stable Diffusion Inpainting

```typescript
// In src/app/api/process/route.ts
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "stability-ai/stable-diffusion-2-inpainting",
    input: {
      image: originalImageDataUrl,
      prompt: `text saying "${text}" placed behind objects`,
      mask: "mask_data_here", // Generated from object detection
    }
  })
})
```

### Option 2: Segment Anything Model (SAM)

1. Use SAM for object detection
2. Generate masks for detected objects
3. Use text-to-image generation to place text behind objects

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# For Replicate API integration
REPLICATE_API_TOKEN=your_replicate_api_token_here

# For other AI services
AI_SERVICE_API_KEY=your_api_key_here
```

## Customization

### Styling

The app uses Tailwind CSS with custom CSS variables for theming. Modify `src/app/globals.css` to change colors and styling.

### Components

All UI components are built with shadcn/ui and can be customized by modifying the component files in `src/components/ui/`.

### AI Processing

Replace the mock implementation in `src/app/api/process/route.ts` with your preferred AI service integration.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js 14, Tailwind CSS, and shadcn/ui
