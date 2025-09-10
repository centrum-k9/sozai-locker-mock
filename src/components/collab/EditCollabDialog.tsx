import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { CollabEvent } from '@/features/collab/types';
import { toast } from 'sonner';

interface EditCollabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collab: CollabEvent;
  onSave: (data: Partial<CollabEvent>) => void;
}

export const EditCollabDialog = ({ open, onOpenChange, collab, onSave }: EditCollabDialogProps) => {
  const [formData, setFormData] = useState<Partial<CollabEvent>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && collab) {
      setFormData({
        title: collab.title,
        description: collab.description || '',
        scheduledAt: collab.scheduledAt || '',
        platform: collab.platform,
        streamUrl: collab.streamUrl || '',
      });
    }
  }, [open, collab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error('タイトルは必須です');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
      toast.success('コラボ情報を更新しました');
    } catch (error) {
      toast.error('更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            コラボ情報を編集
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">タイトル</Label>
            <Input
              id="edit-title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="コラボのタイトル"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">説明</Label>
            <Textarea
              id="edit-description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="コラボの説明（任意）"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-scheduledAt">配信予定日</Label>
            <Input
              id="edit-scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt || ''}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-platform">配信プラットフォーム</Label>
            <Select
              value={formData.platform || ''}
              onValueChange={(value) => setFormData({ ...formData, platform: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="プラットフォームを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Twitch">Twitch</SelectItem>
                <SelectItem value="Niconico">ニコニコ動画</SelectItem>
                <SelectItem value="Other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-streamUrl">配信URL</Label>
            <Input
              id="edit-streamUrl"
              value={formData.streamUrl || ''}
              onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '更新中...' : '更新'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};