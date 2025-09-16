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
      title: '素材アップロード',
      description: '立ち絵やキービジュアルをまとめて保存！',
    },
    {
      icon: Users,
      title: 'コラボリスト',
      description: '友だちと一緒にリスト化。配信準備がもっとラク！',
    },
    {
      icon: Zap,
      title: '告知テキスト自動生成',
      description: '概要欄や告知ポストをワンクリックで用意',
    },
    {
      icon: Share2,
      title: 'OBS素材作成',
      description: 'Discord通話のメンバーをオーバーレイに！',
    },
  ];

  const steps = [
    {
      number: 1,
      title: '素材をアップロード',
      description: '立ち絵・キービジュアルをドラッグ&ドロップ',
      icon: Upload,
    },
    {
      number: 2,
      title: 'コラボ相手をリスト化',
      description: '友だちを追加して一緒に準備',
      icon: Users,
    },
    {
      number: 3,
      title: '一括出力！',
      description: '告知・配信・オーバーレイまで完成',
      icon: Zap,
    },
  ];

  const benefits = [
    '「あれどこ？」って探さなくていい！',
    '告知投稿も1分で完成！',
    'コラボ相手と準備をシェアしてもっと楽しく！',
    '配信に集中できる環境づくり',
    'VTuberさんの「困った」を解決',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container relative z-10">
          <Badge variant="secondary" className="mb-6 animate-bounce-in bg-accent text-accent-foreground">
            🎉 これはラク！
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              コラボの準備、
            </span><br />
            <span className="text-foreground">ぜんぶまとめてラクコラ！</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            立ち絵・キービジュアル・告知文、コラボ配信に必要な素材をラクにまとめて管理・シェア！
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button 
                size="lg" 
                className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect group"
                onClick={() => trackClick('cta-start', 'hero')}
              >
                無料で始める
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/s/main-character-pack">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
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
              コラボ配信に必要なもの、ぜんぶそろう！
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              配信準備がもっとラクになる、VTuber向け機能をご紹介
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
                       <div className="rounded-full bg-accent/20 p-4 text-primary">
                         <Icon className="h-8 w-8" />
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

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                3ステップ
              </span>
              で完了！
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              めんどうな準備作業は、もうおしまい
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
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
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  「配信準備がめんどう...」
                </span>
                <br />
                そんなお悩み、解決します！
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                素材探し、告知作成、OBS設定...配信前の準備って本当に大変ですよね。
                ラクコラなら、そんな「めんどう」をまとめて解決！
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-start space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm">✨</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-4 py-3 flex-1">
                      <p className="text-foreground font-medium">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button 
                  size="lg"
                  className="hero-gradient hover:opacity-90 transition-opacity group"
                  onClick={() => trackClick('cta-benefits', 'benefits')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  無料で始める
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
            コラボ準備、もう悩まない！
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            無料でアカウントを作成して、配信準備をもっとラクに。
            <br />
            あなたの配信ライフを、もっと楽しく！
          </p>
          
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button 
              size="lg"
              className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect animate-glow group text-lg px-8 py-4 h-auto"
              onClick={() => trackClick('cta-final', 'final-cta')}
            >
              今すぐラクコラを始める
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;