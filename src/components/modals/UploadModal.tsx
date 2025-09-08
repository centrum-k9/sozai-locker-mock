import { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload,
  X,
  FileImage,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { assetApi, uploadApi } from '@/services/mockClient';
import { Asset, LicensePreset, Category } from '@/core/types';
import { licensePresetInfo, categoryInfo } from '@/services/seed';
import { toast } from 'sonner';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (asset: Asset) => void;
}

interface UploadFile {
  file: File;
  id: string;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const UploadModal = ({ open, onOpenChange, onUploadComplete }: UploadModalProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [currentFile, setCurrentFile] = useState<UploadFile | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    tags: '',
    licensePreset: 'COMM_OK_CREDIT_REQ' as LicensePreset,
    creditText: '',
  });

  const { user } = useAuth();
  const { trackUploadStart, trackUploadComplete } = useAnalytics();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    if (newFiles.length > 0 && !currentFile) {
      setCurrentFile(newFiles[0]);
      setMetadata(prev => ({
        ...prev,
        title: newFiles[0].file.name.replace(/\.[^/.]+$/, ''),
      }));
    }

    trackUploadStart(newFiles.length);
  }, [currentFile, trackUploadStart]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      const removedFile = prev.find(f => f.id === fileId);
      
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      
      if (currentFile?.id === fileId) {
        setCurrentFile(newFiles[0] || null);
        if (newFiles[0]) {
          setMetadata(prev => ({
            ...prev,
            title: newFiles[0].file.name.replace(/\.[^/.]+$/, ''),
          }));
        }
      }
      
      return newFiles;
    });
  };

  const uploadCurrentFile = async () => {
    if (!currentFile) return;

    setFiles(prev => prev.map(f => 
      f.id === currentFile.id 
        ? { ...f, status: 'uploading' as const }
        : f
    ));

    try {
      // Simulate upload with progress
      const uploadResult = await uploadApi.uploadFile(
        currentFile.file,
        (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === currentFile.id 
              ? { ...f, progress }
              : f
          ));
        }
      );

      // Create asset record
      const assetData = {
        title: metadata.title || currentFile.file.name,
        description: metadata.description || undefined,
        tags: metadata.tags.split(',').map(t => t.trim()).filter(Boolean),
        category: metadata.category || undefined,
        mime: currentFile.file.type,
        size: currentFile.file.size,
        licensePreset: metadata.licensePreset,
        creditText: metadata.creditText || user?.defaultCreditText || undefined,
        previewUrl: uploadResult.previewUrl,
        originalUrl: undefined, // Mock - not implemented yet
      };

      const newAsset = await assetApi.create(assetData);

      setFiles(prev => prev.map(f => 
        f.id === currentFile.id 
          ? { ...f, status: 'completed' as const }
          : f
      ));

      trackUploadComplete(newAsset.id);
      onUploadComplete?.(newAsset);

      // Move to next file or close
      const remainingFiles = files.filter(f => f.status === 'pending');
      if (remainingFiles.length > 1) {
        const nextFile = remainingFiles.find(f => f.id !== currentFile.id);
        if (nextFile) {
          setCurrentFile(nextFile);
          setMetadata(prev => ({
            ...prev,
            title: nextFile.file.name.replace(/\.[^/.]+$/, ''),
            description: '',
            tags: '',
          }));
        } else {
          handleClose();
        }
      } else {
        handleClose();
      }

      toast.success(`「${newAsset.title}」をアップロードしました`);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === currentFile.id 
          ? { ...f, status: 'error' as const, error: 'アップロードに失敗しました' }
          : f
      ));
      toast.error('アップロードに失敗しました');
    }
  };

  const handleClose = () => {
    setFiles([]);
    setCurrentFile(null);
    setMetadata({
      title: '',
      description: '',
      category: '',
      tags: '',
      licensePreset: 'COMM_OK_CREDIT_REQ',
      creditText: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>素材をアップロード</DialogTitle>
          <DialogDescription>
            素材ファイルをアップロードして、メタデータを設定してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          {files.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="p-6">
                <div
                  {...getRootProps()}
                  className={`text-center cursor-pointer transition-colors ${
                    isDragActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileImage className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg font-semibold mb-2">
                    {isDragActive ? 'ファイルをドロップしてください' : 'ファイルを選択またはドラッグ&ドロップ'}
                  </p>
                  <p className="text-sm">
                    画像、音声、動画、ZIP ファイルに対応（最大 100MB）
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">アップロードファイル ({files.length})</h3>
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 rounded border">
                      {file.preview && (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{(file.file.size / 1024 / 1024).toFixed(1)} MB</span>
                          {file.status === 'uploading' && (
                            <Progress value={file.progress} className="w-16 h-2" />
                          )}
                          {file.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {file.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current File Metadata */}
          {currentFile && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">
                  メタデータを設定: {currentFile.file.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">タイトル *</Label>
                    <Input
                      id="title"
                      value={metadata.title}
                      onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="素材のタイトル"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">カテゴリ</Label>
                    <Select 
                      value={metadata.category} 
                      onValueChange={(value: Category) => setMetadata(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryInfo).map(([key, info]) => (
                          <SelectItem key={key} value={key}>
                            {info.icon} {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="素材の説明や使用方法など"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">タグ</Label>
                  <Input
                    id="tags"
                    value={metadata.tags}
                    onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="タグをカンマ区切りで入力（例: VTuber, 立ち絵, かわいい）"
                  />
                </div>

                <div>
                  <Label htmlFor="license">ライセンス</Label>
                  <Select 
                    value={metadata.licensePreset} 
                    onValueChange={(value: LicensePreset) => setMetadata(prev => ({ ...prev, licensePreset: value }))}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {licensePresetInfo[metadata.licensePreset].description}
                  </p>
                </div>

                {(metadata.licensePreset.includes('CREDIT') || metadata.licensePreset === 'CUSTOM') && (
                  <div>
                    <Label htmlFor="credit">クレジット表記</Label>
                    <Input
                      id="credit"
                      value={metadata.creditText}
                      onChange={(e) => setMetadata(prev => ({ ...prev, creditText: e.target.value }))}
                      placeholder={user?.defaultCreditText || '@YourName'}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={uploadCurrentFile}
                    disabled={!metadata.title || currentFile.status === 'uploading'}
                    className="hero-gradient hover:opacity-90 transition-opacity"
                  >
                    {currentFile.status === 'uploading' ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        アップロード中...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        アップロード
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={handleClose}>
                    キャンセル
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};