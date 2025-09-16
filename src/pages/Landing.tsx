import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Share2, 
  Shield, 
  Zap, 
  Users, 
  Download,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';

export const Landing = () => {
  const { trackPageView, trackClick } = useAnalytics();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    trackPageView('landing');
  }, [trackPageView]);

  const features = [
    {
      icon: Upload,
      title: '簡単アップロード',
      description: 'ドラッグ&ドロップで素材を瞬時にアップロード。自動的にサムネイルも生成されます。',
    },
    {
      icon: Share2,
      title: '安全な共有',
      description: 'パスワード保護や有効期限付きの共有リンクで、素材を安全に配布できます。',
    },
    {
      icon: Shield,
      title: 'ライセンス管理',
      description: '利用許諾を明確に設定し、クレジット表記も自動で管理。安心して素材を提供できます。',
    },
    {
      icon: Zap,
      title: '透かし機能',
      description: 'プレビュー時の透かし表示で、素材を保護しながら内容を確認してもらえます。',
    },
  ];

  const benefits = [
    'VTuber・クリエイター向けに最適化',
    '商用・個人利用の細かい権利設定',
    'ダウンロード履歴の追跡',
    'コレクション機能で素材をまとめて管理',
    'モバイル対応で外出先でも確認可能',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container relative z-10">
          <Badge variant="secondary" className="mb-6 animate-bounce-in">
            🎉 MVP版公開中！
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              素材管理を
            </span><br />
            <span className="text-foreground">もっとスマートに</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            VTuber・クリエイター向けの素材管理プラットフォーム「ラクコラ」。
            <br />
            ライセンス管理から安全な共有まで、すべてをワンストップで。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button 
                size="lg" 
                className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect group"
                onClick={() => trackClick('cta-start', 'hero')}
              >
                今すぐ始める
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/s/main-character-pack">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/20 hover:border-primary/40 transition-colors"
                onClick={() => trackClick('demo-link', 'hero')}
              >
                デモを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              クリエイターのための機能
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              素材管理に必要な機能をすべて搭載。安全で使いやすいプラットフォームです。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="card-gradient border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-lg bg-gradient-to-br from-primary to-primary-glow p-3 text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                VTuber業界に特化した
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  素材管理システム
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                立ち絵、サムネイル素材、BGM、効果音など、VTuber活動に必要な素材を効率的に管理・共有できます。
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li 
                    key={benefit} 
                    className="flex items-center animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button 
                  size="lg"
                  className="hero-gradient hover:opacity-90 transition-opacity"
                  onClick={() => trackClick('cta-benefits', 'benefits')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  今すぐ始める
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3" />
              <Card className="relative card-gradient border-0 p-8">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground mb-4">
                      <Download className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">共有リンクでの配布</h3>
                    <p className="text-muted-foreground">
                      パスワード保護や期限設定で、安全に素材を配布できます
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono">
                    <div className="text-muted-foreground mb-1">共有リンク例:</div>
                    <div className="text-primary">
                      rakukora.com/s/main-character-pack
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            素材管理を始めませんか？
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            無料でアカウントを作成して、今すぐラクコラを体験してください。
            あなたのクリエイティブワークをより効率的に。
          </p>
          
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button 
              size="lg"
              className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect animate-glow"
              onClick={() => trackClick('cta-final', 'final-cta')}
            >
              無料で始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;