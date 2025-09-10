import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Search,
  Monitor,
  Download,
  Copy,
  ExternalLink,
  Settings,
  Users,
  MessageSquare,
  Palette,
  Grid,
  List,
  Eye,
  Code
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collabsApi } from '@/features/collab/services/collabs';
import { friendsApi } from '@/features/collab/services/friends';
import { discordService } from '@/features/overlay/services/discord';
import { overlayConfigService } from '@/features/overlay/services/configs';
import { overlayGenerator } from '@/features/overlay/services/generator';
import { 
  CollabEvent, 
  CollabMember, 
  Friend 
} from '@/features/collab/types';
import { 
  DiscordGuild, 
  DiscordChannel, 
  DiscordVoiceMember,
  OverlayConfig,
  OverlayMode,
  OverlayLayout,
  defaultAppearance
} from '@/features/overlay/types';
import { toast } from 'sonner';

const OverlayGenerator = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [collab, setCollab] = useState<CollabEvent | null>(null);
  const [members, setMembers] = useState<CollabMember[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Discord integration state
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [voiceMembers, setVoiceMembers] = useState<DiscordVoiceMember[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [guildSearch, setGuildSearch] = useState('');
  const [channelSearch, setChannelSearch] = useState('');

  // Overlay configuration state
  const [mode, setMode] = useState<OverlayMode>('aggregate');
  const [layout, setLayout] = useState<OverlayLayout>('grid');
  const [appearance, setAppearance] = useState(defaultAppearance);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');
  const [hostedUrl, setHostedUrl] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [collabData, membersData, friendsData, guildsData] = await Promise.all([
          collabsApi.getEvent(id),
          collabsApi.getMembers(id),
          friendsApi.list(),
          discordService.searchGuilds('')
        ]);

        if (!collabData) {
          toast.error('コラボが見つかりません');
          navigate('/collabs');
          return;
        }

        setCollab(collabData);
        setMembers(membersData);
        setFriends(friendsData);
        setGuilds(guildsData);
      } catch (error) {
        toast.error('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleGuildSelect = async (guildId: string) => {
    setSelectedGuild(guildId);
    setSelectedChannel('');
    setChannels([]);
    setVoiceMembers([]);

    if (guildId) {
      try {
        const channelData = await discordService.searchChannels(guildId, channelSearch);
        setChannels(channelData);
      } catch (error) {
        toast.error('チャンネルの取得に失敗しました');
      }
    }
  };

  const handleChannelSelect = async (channelId: string) => {
    setSelectedChannel(channelId);
    setVoiceMembers([]);

    if (channelId) {
      try {
        const membersData = await discordService.listVoiceMembers(channelId);
        setVoiceMembers(membersData);
        setSelectedMembers(membersData.map(m => m.id));
      } catch (error) {
        toast.error('ボイスメンバーの取得に失敗しました');
      }
    }
  };

  const handleGenerateOverlay = async () => {
    if (!collab) return;

    setIsGenerating(true);
    try {
      const configId = overlayConfigService.generateId();
      const config: OverlayConfig = {
        id: configId,
        collabId: collab.id,
        mode,
        layout,
        guildId: selectedGuild,
        channelId: selectedChannel,
        memberIds: selectedMembers,
        appearance,
        createdAt: new Date().toISOString(),
      };

      await overlayConfigService.createOrUpdate(config);

      // Prepare member data for generation
      const memberData = voiceMembers
        .filter(vm => selectedMembers.includes(vm.id))
        .map(vm => ({
          id: vm.id,
          displayName: vm.displayName,
          discordAvatar: vm.avatarUrl,
          standingImage: null, // TODO: Map to collab friends
          keyVisual: null,
        }));

      if (mode === 'aggregate') {
        const source = await overlayGenerator.generateAggregateHTML(config, memberData);
        setGeneratedHTML(source.html);
        setHostedUrl(window.location.origin + source.hostedUrl);
        toast.success('オーバーレイを生成しました');
      } else {
        const sources = await overlayGenerator.generateIndividualHTMLs(config, memberData);
        if (sources.length > 0) {
          setGeneratedHTML(sources[0].html); // Show first for preview
          setHostedUrl(window.location.origin + sources[0].hostedUrl);
          toast.success(`${sources.length}個の個別オーバーレイを生成しました`);
        }
      }
    } catch (error) {
      toast.error('オーバーレイの生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generatedHTML);
    toast.success('HTMLコードをコピーしました');
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overlay-${mode}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTMLファイルをダウンロードしました');
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">コラボが見つかりません</p>
        <Button asChild className="mt-4">
          <Link to="/collabs">コラボ一覧に戻る</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/collabs/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center">
            <Monitor className="mr-3 h-8 w-8" />
            オーバーレイ生成
          </h1>
          <p className="text-muted-foreground mt-1">{collab.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Step 1: Discord Selection */}
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                1. サーバー・チャンネル選択
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Guild Selection */}
              <div className="space-y-2">
                <Label>Discordサーバー</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="サーバーを検索..."
                    value={guildSearch}
                    onChange={(e) => setGuildSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={selectedGuild} onValueChange={handleGuildSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="サーバーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {guilds.map((guild) => (
                      <SelectItem key={guild.id} value={guild.id}>
                        {guild.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Channel Selection */}
              {selectedGuild && (
                <div className="space-y-2">
                  <Label>ボイスチャンネル</Label>
                  <Select value={selectedChannel} onValueChange={handleChannelSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="チャンネルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {channel.type}
                            </Badge>
                            {channel.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Mode Selection */}
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                2. 表示モード
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(value) => setMode(value as OverlayMode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="aggregate">まとめて表示</TabsTrigger>
                  <TabsTrigger value="individual">個別表示</TabsTrigger>
                </TabsList>
                <TabsContent value="aggregate" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    すべてのメンバーを1つのオーバーレイに表示します
                  </p>
                </TabsContent>
                <TabsContent value="individual" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    メンバーごとに個別のオーバーレイを生成します
                  </p>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Label>レイアウト</Label>
                <Select value={layout} onValueChange={(value) => setLayout(value as OverlayLayout)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">
                      <div className="flex items-center gap-2">
                        <Grid className="h-4 w-4" />
                        グリッド
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        リスト
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Appearance Settings */}
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                3. 見た目設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={appearance.showName}
                    onCheckedChange={(checked) =>
                      setAppearance({ ...appearance, showName: checked })
                    }
                  />
                  <Label>名前を表示</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={appearance.showAvatar}
                    onCheckedChange={(checked) =>
                      setAppearance({ ...appearance, showAvatar: checked })
                    }
                  />
                  <Label>アバター表示</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={appearance.showStandingImage}
                    onCheckedChange={(checked) =>
                      setAppearance({ ...appearance, showStandingImage: checked })
                    }
                  />
                  <Label>立ち絵表示</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={appearance.highlightSpeaking}
                    onCheckedChange={(checked) =>
                      setAppearance({ ...appearance, highlightSpeaking: checked })
                    }
                  />
                  <Label>発話ハイライト</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>背景設定</Label>
                <Select
                  value={appearance.background}
                  onValueChange={(value) =>
                    setAppearance({ ...appearance, background: value as 'transparent' | 'solid' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transparent">透明</SelectItem>
                    <SelectItem value="solid">ソリッド</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>角丸: {appearance.cornerRadius}px</Label>
                <Slider
                  value={[appearance.cornerRadius]}
                  onValueChange={([value]) =>
                    setAppearance({ ...appearance, cornerRadius: value })
                  }
                  max={20}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>間隔: {appearance.gap}px</Label>
                <Slider
                  value={[appearance.gap]}
                  onValueChange={([value]) =>
                    setAppearance({ ...appearance, gap: value })
                  }
                  max={32}
                  step={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateOverlay}
            disabled={isGenerating || !selectedChannel}
            className="w-full hero-gradient hover:opacity-90"
            size="lg"
          >
            {isGenerating ? '生成中...' : 'オーバーレイを生成'}
          </Button>
        </div>

        {/* Preview & Output Panel */}
        <div className="space-y-6">
          {/* Voice Members Preview */}
          {voiceMembers.length > 0 && (
            <Card className="card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  通話メンバー ({voiceMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {voiceMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {member.displayName[0]}
                      </div>
                      <span className="flex-1">{member.displayName}</span>
                      {member.speaking && (
                        <Badge variant="default" className="text-xs">
                          発話中
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Output */}
          {generatedHTML && (
            <Card className="card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  生成結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleCopyHTML} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    HTMLをコピー
                  </Button>
                  <Button onClick={handleDownloadHTML} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    ダウンロード
                  </Button>
                </div>

                {hostedUrl && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-xs font-medium">アプリ内URL:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={hostedUrl}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(hostedUrl);
                          toast.success('URLをコピーしました');
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>• OBSのブラウザソースにHTMLまたはURLを設定してください</p>
                  <p>• 推奨解像度: 1920x1080</p>
                  <p>• 透明背景が選択されている場合、Webページの不透明度は100%に設定してください</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverlayGenerator;