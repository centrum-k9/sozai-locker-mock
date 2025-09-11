import { cn } from '@/lib/utils';

interface WatermarkedImageProps {
  src?: string;
  alt: string;
  className?: string;
  noWatermark?: boolean;
}

export function WatermarkedImage({ 
  src, 
  alt, 
  className,
  noWatermark = false 
}: WatermarkedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">画像なし</span>
        </div>
      )}
      
      {!noWatermark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-white/60 font-bold text-lg select-none opacity-70"
              style={{
                transform: 'rotate(-45deg)',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '2px'
              }}
            >
              SozaiLocker
            </div>
          </div>
        </div>
      )}
    </div>
  );
}