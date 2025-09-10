import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CollabEvent } from '@/features/collab/types';
import { collabsApi } from '@/features/collab/services/collabs';
import { toast } from 'sonner';

interface CreateCollabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollabCreated?: (collab: CollabEvent) => void;
}

export const CreateCollabModal = ({ open, onOpenChange, onCollabCreated }: CreateCollabModalProps) => {
  const [title, setTitle] = useState('');
  const [collaboratorName, setCollaboratorName] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [platform, setPlatform] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isFormValid = title.trim() && collaboratorName.trim() && scheduledDate;

  const handleCreate = async () => {
    if (!isFormValid) {
      toast.error('必須項目を入力してください');
      return;
    }

    setIsCreating(true);
    try {
      const newCollab = await collabsApi.createEvent({
        title: title.trim(),
        description: `${collaboratorName}さんとのコラボ配信`,
        scheduledAt: scheduledDate!.toISOString(),
        platform: platform as any,
        streamUrl: streamUrl || undefined
      });

      onCollabCreated?.(newCollab);
      onOpenChange(false);
      toast.success('コラボリストを作成しました');
      
      // Reset form
      setTitle('');
      setCollaboratorName('');
      setScheduledDate(undefined);
      setPlatform('');
      setStreamUrl('');
    } catch (error) {
      toast.error('コラボリストの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しいコラボを作成</DialogTitle>
          <DialogDescription>
            コラボ相手との素材管理用のリストを作成します
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Required Fields */}
          <div className="grid gap-2">
            <Label htmlFor="title">
              リスト名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: ミクちゃんとのコラボ配信"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="collaborator">
              コラボ相手 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="collaborator"
              value={collaboratorName}
              onChange={(e) => setCollaboratorName(e.target.value)}
              placeholder="例: ミクちゃん"
            />
          </div>

          <div className="grid gap-2">
            <Label>
              配信予定日 <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Optional Fields */}
          <div className="grid gap-2">
            <Label htmlFor="platform">配信プラットフォーム</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="プラットフォームを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Twitch">Twitch</SelectItem>
                <SelectItem value="Niconico">ニコニコ生放送</SelectItem>
                <SelectItem value="Other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="streamUrl">配信URL</Label>
            <Input
              id="streamUrl"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!isFormValid || isCreating}
            className="hero-gradient"
          >
            {isCreating ? '作成中...' : '作成'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};