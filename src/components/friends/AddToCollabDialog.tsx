import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar } from 'lucide-react';
import { Friend } from '@/features/collab/types';
import { collabsApi } from '@/features/collab/services/collabs';
import { toast } from 'sonner';

interface AddToCollabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: Friend;
}

export const AddToCollabDialog = ({ open, onOpenChange, friend }: AddToCollabDialogProps) => {
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedCollab, setSelectedCollab] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingCollabs] = useState([
    { id: 'collab-1', title: '今度のコラボ配信' },
    { id: 'collab-2', title: '歌ってみた企画' }
  ]);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      if (mode === 'new') {
        if (!title.trim()) {
          toast.error('コラボ名を入力してください');
          return;
        }

        // Mock collab creation
        const newCollab = { id: 'new-collab', title };
        
        toast.success(`${friend.displayName}を新しいコラボに追加しました`);

        toast.success(`${friend.displayName}を新しいコラボに追加しました`);
      } else {
        if (!selectedCollab) {
          toast.error('コラボを選択してください');
          return;
        }

        // Mock member addition

        toast.success(`${friend.displayName}をコラボに追加しました`);
      }

      onOpenChange(false);
      setTitle('');
      setScheduledDate('');
      setSelectedCollab('');
    } catch (error) {
      toast.error('コラボへの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            {friend.displayName}をコラボに追加
          </DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as 'new' | 'existing')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">新規作成</TabsTrigger>
            <TabsTrigger value="existing">既存から選択</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">コラボ名</Label>
              <Input
                id="title"
                placeholder="例: 歌ってみたコラボ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">配信予定日（任意）</Label>
              <Input
                id="date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-2">
              <Label>既存のコラボから選択</Label>
              <RadioGroup value={selectedCollab} onValueChange={setSelectedCollab}>
                {existingCollabs.map((collab) => (
                  <div key={collab.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={collab.id} id={collab.id} />
                    <Label htmlFor={collab.id} className="flex items-center cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      {collab.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {existingCollabs.length === 0 && (
                <p className="text-sm text-muted-foreground">既存のコラボがありません</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? '追加中...' : '追加'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};