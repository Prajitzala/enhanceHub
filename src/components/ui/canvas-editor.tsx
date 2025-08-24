import { useRef, useEffect } from "react";

interface TextSettings {
  value: string;
  size: number;
  color: string;
  x: number;
  y: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  opacity?: number;
}

interface CanvasEditorProps {
  bg: string;
  fg: string;
  text: TextSettings;
  className?: string;
}

export default function CanvasEditor({ bg, fg, text, className = "" }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!bg || !fg) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const bgImg = new window.Image();
    const fgImg = new window.Image();

    bgImg.src = bg;
    fgImg.src = fg;

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Step 1: Draw background layer
      ctx.drawImage(bgImg, 0, 0);

      // Step 2: Draw text layer (behind foreground objects)
      ctx.save();
      
      // Configure text properties
      const fontWeight = text.bold ? 'bold' : 'normal';
      const fontStyle = text.italic ? 'italic' : 'normal';
      const fontFamily = text.fontFamily || 'Arial, sans-serif';
      ctx.font = `${fontStyle} ${fontWeight} ${text.size}px ${fontFamily}`;
      ctx.fillStyle = text.color;
      ctx.globalAlpha = text.opacity || 1;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // Add shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw text
      ctx.fillText(text.value, text.x, text.y);
      
      ctx.restore();

      // Step 3: Draw foreground layer (on top of text)
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0);
      };
    };
  }, [bg, fg, text]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`rounded-xl shadow-lg ${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

