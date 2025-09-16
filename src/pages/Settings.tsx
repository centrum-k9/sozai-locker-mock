import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { userApi } from '@/services/mockClient';
import { LicensePreset } from '@/core/types';
import { licensePresetInfo } from '@/services/seed';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { trackPageView, trackSettingsChange } = useAnalytics();
  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    defaultLicense: user?.defaultLicense || 'COMM_OK_CREDIT_REQ' as LicensePreset,
    defaultCreditText: user?.defaultCreditText || '',
    watermarkText: user?.watermarkText || 'ラクコラ',
    watermarkOpacity: user?.watermarkOpacity || 0.3,
  });

  useEffect(() => {
    trackPageView('settings');
  }, [trackPageView]);

  const handleSave = async () => {
    try {
      await userApi.update(settings);
      toast.success('設定を保存しました');
      trackSettingsChange('profile', settings);
    } catch (error) {
      toast.error('設定の保存に失敗しました');
    }
  };

  return (
    <div className="container py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-muted-foreground">アカウントと素材の既定設定を管理します</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
          <CardDescription>基本的なアカウント情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* License Settings - Hidden per requirements */}
      {false && (
      <Card>
        <CardHeader>
          <CardTitle>既定のライセンス設定</CardTitle>
          <CardDescription>新しい素材の既定のライセンス</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ライセンス</Label>
            <Select 
              value={settings.defaultLicense} 
              onValueChange={(value: LicensePreset) => 
                setSettings(prev => ({ ...prev, defaultLicense: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(licensePresetInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="creditText">既定のクレジット表記</Label>
            <Input
              id="creditText"
              value={settings.defaultCreditText}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultCreditText: e.target.value }))}
              placeholder="@YourName"
            />
          </div>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>透かし設定</CardTitle>
          <CardDescription>プレビュー時の透かし表示設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="watermarkText">透かしテキスト</Label>
            <Input
              id="watermarkText"
              value={settings.watermarkText}
              onChange={(e) => setSettings(prev => ({ ...prev, watermarkText: e.target.value }))}
            />
          </div>
          <div>
            <Label>透明度: {Math.round(settings.watermarkOpacity * 100)}%</Label>
            <Slider
              value={[settings.watermarkOpacity]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, watermarkOpacity: value[0] }))}
              max={1}
              min={0.1}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div className="watermark-overlay aspect-video bg-muted rounded-lg relative overflow-hidden" data-watermark={settings.watermarkText}>
            {/* Mock standing image preview */}
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center">
              <div className="w-24 h-32 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-xs text-primary">立ち絵</span>
              </div>
            </div>
            {/* Watermark overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ opacity: settings.watermarkOpacity }}
            >
              <div className="text-white text-lg font-bold bg-black/50 px-2 py-1 rounded">
                {settings.watermarkText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full hero-gradient">
        設定を保存
      </Button>
    </div>
  );
};

export default Settings;