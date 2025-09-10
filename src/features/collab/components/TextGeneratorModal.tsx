import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Friend, TextPattern } from '../types';
import { 
  generateCollabText, 
  countCharacters, 
  isWithinTwitterLimit,
  getPatternDescription,
  getPatternLabel 
} from '../services/textTemplates';

interface TextGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Friend[];
  eventTitle?: string;
}

export const TextGeneratorModal: React.FC<TextGeneratorModalProps> = ({
  open,
  onOpenChange,
  members,
  eventTitle,
}) => {
  const [activePattern, setActivePattern] = useState<TextPattern>('overview');
  const [generatedText, setGeneratedText] = useState('');
  const [copiedStates, setCopiedStates] = useState<Record<TextPattern, boolean>>({
    overview: false,
    'announcement-a': false,
    'announcement-b': false,
  });

  const patterns: TextPattern[] = ['overview', 'announcement-a', 'announcement-b'];

  useEffect(() => {
    if (members.length > 0) {
      const text = generateCollabText({
        pattern: activePattern,
        members,
        eventTitle,
      });
      setGeneratedText(text);
    }
  }, [activePattern, members, eventTitle]);

  const handleCopy = async (pattern: TextPattern) => {
    const text = generateCollabText({
      pattern,
      members,
      eventTitle,
    });

    try {
      await navigator.clipboard.writeText(text);
      
      setCopiedStates(prev => ({ ...prev, [pattern]: true }));
      toast.success('テキストをコピーしました！');
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [pattern]: false }));
      }, 2000);
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  const characterCount = countCharacters(generatedText);
  const isTwitterSafe = isWithinTwitterLimit(generatedText);

  if (members.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              貼り付けテキスト生成
            </DialogTitle>
            <DialogDescription>
              コラボメンバーが選択されていません。先にメンバーを追加してください。
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            貼り付けテキスト生成
          </DialogTitle>
          <DialogDescription>
            コラボメンバー情報から各種テキストを自動生成します
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activePattern} onValueChange={(value) => setActivePattern(value as TextPattern)}>
          <TabsList className="grid w-full grid-cols-3">
            {patterns.map((pattern) => (
              <TabsTrigger key={pattern} value={pattern} className="text-xs">
                {getPatternLabel(pattern)}
              </TabsTrigger>
            ))}
          </TabsList>

          {patterns.map((pattern) => (
            <TabsContent key={pattern} value={pattern} className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{getPatternLabel(pattern)}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={isTwitterSafe ? "default" : "destructive"}>
                          {characterCount}文字
                        </Badge>
                        {!isTwitterSafe && (
                          <Badge variant="outline" className="text-orange-600">
                            Twitter制限超過
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {getPatternDescription(pattern)}
                    </p>

                    <Textarea
                      value={generateCollabText({ pattern, members, eventTitle })}
                      readOnly
                      className="min-h-[120px] font-mono text-sm"
                      placeholder="テキストが生成されます..."
                    />

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        参加メンバー: {members.length}名
                      </div>
                      
                      <Button
                        onClick={() => handleCopy(pattern)}
                        className="hero-gradient hover:opacity-90"
                        size="sm"
                      >
                        {copiedStates[pattern] ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            コピー完了
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            コピー
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <h5 className="font-medium mb-2">💡 使い方のヒント</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>概要欄用</strong>: YouTubeやTwitchの配信概要に貼り付け</li>
            <li>• <strong>告知A</strong>: X（Twitter）での告知投稿用（@メンション）</li>
            <li>• <strong>告知B</strong>: X（Twitter）での告知投稿用（#ハッシュタグ）</li>
            <li>• SNS情報が未入力のメンバーはリンクが省略されます</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};