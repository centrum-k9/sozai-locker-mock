import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor } from 'lucide-react';
import { OverlayAppearance } from '@/features/overlay/types';

interface OverlayPreviewPaneProps {
  appearance: OverlayAppearance;
  members: Array<{
    id: string;
    displayName: string;
    isSpeaking?: boolean;
  }>;
}

export const OverlayPreviewPane = ({ appearance, members }: OverlayPreviewPaneProps) => {
  return (
    <Card className="card-gradient border-0 sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="mr-2 h-5 w-5" />
          プレビュー（OBSブラウザソース）
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 flex items-center justify-center overflow-hidden"
          style={{ gap: `${appearance.gap}px` }}
        >
          {members.length > 0 ? (
            <div className="flex gap-4 flex-wrap justify-center">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`relative transition-all duration-300 ${
                    member.isSpeaking && appearance.highlightSpeaking
                      ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50 animate-bounce'
                      : 'opacity-70'
                  }`}
                  style={{ 
                    borderRadius: `${appearance.cornerRadius}px`,
                    backgroundColor: appearance.background === 'solid' ? 'rgba(0,0,0,0.8)' : 'transparent'
                  }}
                >
                  {/* Discord Avatar */}
                  <div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm transition-all duration-300 ${
                      member.isSpeaking && appearance.highlightSpeaking 
                        ? 'ring-2 ring-yellow-300 shadow-lg' 
                        : ''
                    }`}
                  >
                    {member.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  
                  {/* Name */}
                  {appearance.showName && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                      {member.displayName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50">
              <Monitor className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Discordチャンネルを選択してください</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>発話状態:</span>
            <span>黄色の光る効果でデモ表示</span>
          </div>
          <div className="flex items-center justify-between">
            <span>解像度:</span>
            <span>1920x1080 (16:9)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};