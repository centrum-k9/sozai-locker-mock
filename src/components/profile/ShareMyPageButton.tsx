import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { shareApi } from '@/services/mockClient';
import { toast } from 'sonner';

export const ShareMyPageButton = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const handleShare = async () => {
    if (!user) return;

    setIsSharing(true);
    try {
      // Generate share link for user profile
      const shareLink = await shareApi.create({
        type: 'asset',
        targetId: user.id,
        canDownload: true,
        passwordEnabled: false,
      });

      const shareUrl = `${window.location.origin}/s/${shareLink.slug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('マイページの共有リンクをコピーしました');
    } catch (error) {
      toast.error('共有リンクの作成に失敗しました');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="h-4 w-4 mr-2" />
      {isSharing ? '作成中...' : 'マイページ共有'}
    </Button>
  );
};