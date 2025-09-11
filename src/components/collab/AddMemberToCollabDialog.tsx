import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, User } from 'lucide-react';
import { Friend } from '@/features/collab/types';
import { friendsApi } from '@/features/collab/services/friends';
import { toast } from 'sonner';

interface AddMemberToCollabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembersAdded: (memberIds: string[]) => void;
  existingMemberIds?: string[];
}

export const AddMemberToCollabDialog = ({ 
  open, 
  onOpenChange, 
  onMembersAdded,
  existingMemberIds = []
}: AddMemberToCollabDialogProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friendsData = await friendsApi.list();
        // Filter out existing members
        const availableFriends = friendsData.filter(
          friend => !existingMemberIds.includes(friend.id)
        );
        setFriends(availableFriends);
      } catch (error) {
        toast.error('友だちリストの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadFriends();
    }
  }, [open, existingMemberIds]);

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriendIds(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddMembers = () => {
    if (selectedFriendIds.length === 0) {
      toast.error('追加するメンバーを選択してください');
      return;
    }

    onMembersAdded(selectedFriendIds);
    onOpenChange(false);
    setSelectedFriendIds([]);
    
    toast.success(`${selectedFriendIds.length}名のメンバーを追加しました`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            コラボ相手を追加
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="flex-1 h-4 bg-muted rounded" />
                    <div className="w-4 h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : friends.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground">
                追加するメンバーを選択してください ({selectedFriendIds.length}名選択中)
              </div>
              
              <ScrollArea className="max-h-60">
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleFriend(friend.id)}
                    >
                      <Checkbox
                        checked={selectedFriendIds.includes(friend.id)}
                        onCheckedChange={() => handleToggleFriend(friend.id)}
                      />
                      
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.defaultStandingAssetId || friend.defaultKeyVisualAssetId} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{friend.displayName}</p>
                        {friend.xHandle && (
                          <p className="text-xs text-muted-foreground">@{friend.xHandle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">追加可能な友だちがいません</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleAddMembers}
            disabled={selectedFriendIds.length === 0}
            className="hero-gradient hover:opacity-90"
          >
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};