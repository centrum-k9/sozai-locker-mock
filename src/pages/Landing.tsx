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
  CheckCircle,
  Sparkles,
  Star
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
      description: '立ち絵やキービジュアルをまとめて保存しちゃおう！',
    },
    {
      icon: Users,
      title: 'コラボリスト',
      description: '友だちと一緒にリスト化。配信準備がもっとラク！',
    },
    {
      icon: Zap,
      title: '告知テキスト自動生成',
      description: '概要欄や告知ポストをワンクリックで用意！',
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
    '告知投稿も1分で完成しちゃう！',
    'コラボ相手と準備をシェアしてもっと楽しく！',
    '配信に集中できる環境づくり',
    'VTuberさんの「困った」を解決！',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        
        {/* Floating decorations */}
        <div className="absolute top-10 left-10 animate-bounce-slow">
          <Star className="w-8 h-8 text-accent fill-accent opacity-50" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-10 h-10 text-primary opacity-40" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-slow" style={{ animationDelay: '1s' }}>
          <Star className="w-6 h-6 text-primary fill-primary opacity-30" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-8 h-8 text-accent opacity-50" />
        </div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 animate-wiggle bg-accent text-accent-foreground shadow-glow inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                これはラク！
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  コラボの準備、
                </span><br />
                <span className="text-foreground">ぜんぶまとめてラクコラ！</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
                立ち絵・キービジュアル・告知文、コラボ配信に必要な素材をラクにまとめて管理・シェア！
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                  <Button 
                    size="lg" 
                    className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect group hover:scale-105"
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
                    className="bg-accent text-accent-foreground hover:bg-accent/80 transition-all hover:scale-105"
                    onClick={() => trackClick('demo-link', 'hero')}
                  >
                    デモを見る
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 animate-fade-in">
                ✨ ほんの1分で登録できるよ！
              </p>
            </div>
            
            {/* Hero Decorative Element */}
            <div className="hidden lg:flex items-center justify-center animate-float">
              <div className="relative w-96 h-96">
                {/* Central gradient circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/20 rounded-full blur-3xl" />
                <div className="absolute inset-8 bg-gradient-to-tr from-accent/40 to-primary/30 rounded-full blur-2xl animate-pulse" />
                
                {/* Decorative floating icons */}
                <div className="absolute top-1/4 left-1/4 animate-float">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-glow">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="w-18 h-18 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center shadow-glow">
                    <Zap className="w-9 h-9 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1/4 right-1/3 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/90 to-primary/90 flex items-center justify-center shadow-glow">
                    <Share2 className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                {/* Center sparkle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-accent fill-accent animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold">
                コラボ配信に必要なもの、ぜんぶそろう！
              </h2>
              <Star className="w-6 h-6 text-accent fill-accent animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              配信準備がもっとラクになる、VTuber向け機能をご紹介✨
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="card-gradient border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-2 animate-fade-in relative overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center relative">
                    {/* Decorative gradient circle on hover */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                    
                    <div className="mb-4 flex justify-center relative">
                      <div className="rounded-full bg-gradient-to-br from-accent/30 to-primary/20 p-4 text-primary shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8" />
                      </div>
                      {/* Small decorative star */}
                      <Star className="absolute -top-2 -right-2 w-5 h-5 text-accent fill-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-background relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-30">
          <Sparkles className="w-12 h-12 text-accent animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-30">
          <Star className="w-12 h-12 text-primary fill-primary animate-pulse" />
        </div>
        
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                3ステップ
              </span>
              で完了！
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              めんどうな準備作業は、もうおしまい✨
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div 
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative mb-6">
                      {/* Decorative icon circle */}
                      <div className="w-32 h-32 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl animate-pulse" />
                        <div className="absolute inset-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center">
                          <Icon className="w-16 h-16 text-primary" />
                        </div>
                        {/* Small stars around */}
                        <Star className="absolute -top-2 -right-2 w-6 h-6 text-accent fill-accent animate-pulse" />
                        <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                      </div>
                      
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-20 -right-6 text-accent animate-bounce-x">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
        {/* Confetti decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-40 left-40 w-2 h-2 bg-accent rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-40 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container relative">
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
              
              {/* Benefits with speech bubble design */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-start space-x-3 animate-fade-in group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Star className="w-6 h-6 text-accent fill-accent" />
                    </div>
                    <div className="relative bg-gradient-to-r from-background to-muted/50 rounded-2xl rounded-tl-none px-5 py-4 flex-1 border-2 border-accent/20 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-foreground font-medium">{benefit}</p>
                      {/* Speech bubble tail */}
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-background border-l-2 border-t-2 border-accent/20 transform -rotate-45" />
                    </div>
                  </div>
                ))}
              </div>

              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button 
                  size="lg"
                  className="hero-gradient hover:opacity-90 transition-all hover:scale-105 group shadow-glow"
                  onClick={() => trackClick('cta-benefits', 'benefits')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  無料で始める
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              {/* Decorative floating element */}
              <div className="absolute -top-10 -left-10 w-32 h-32 animate-float">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-accent/40 to-primary/40 blur-2xl" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-primary" />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3 blur-sm" />
              <Card className="relative card-gradient border-0 p-8 shadow-glow">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground mb-4 shadow-md relative">
                      <Download className="h-8 w-8" />
                      <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-lg -z-10 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">共有リンクでの配布</h3>
                    <p className="text-muted-foreground">
                      パスワード保護や期限設定で、安全に素材を配布できます✨
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono border border-accent/20">
                    <div className="text-muted-foreground mb-1">共有リンク例:</div>
                    <div className="text-primary font-semibold">
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
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating stars and sparkles */}
        <div className="absolute top-20 left-1/4 animate-float">
          <Star className="w-8 h-8 text-accent fill-accent opacity-60" />
        </div>
        <div className="absolute bottom-20 right-1/4 animate-float" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-10 h-10 text-primary opacity-50" />
        </div>
        <div className="absolute top-1/2 left-10 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="w-6 h-6 text-primary fill-primary opacity-40" />
        </div>
        <div className="absolute top-1/3 right-10 animate-float" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-8 h-8 text-accent opacity-60" />
        </div>
        
        <div className="container text-center relative">
          {/* Decorative element */}
          <div className="inline-block mb-6 animate-bounce-in relative">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full blur-2xl animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-br from-accent/60 to-primary/60 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <Star className="absolute -top-2 -right-2 w-8 h-8 text-accent fill-accent animate-spin" style={{ animationDuration: '3s' }} />
              <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-primary fill-primary animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            コラボ準備、もう悩まない！
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            無料でアカウントを作成して、配信準備をもっとラクに。
            <br />
            あなたの配信ライフを、もっと楽しく！✨
          </p>
          
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button 
              size="lg"
              className="hero-gradient hover:opacity-90 transition-all duration-300 glow-effect group text-lg px-8 py-6 h-auto hover:scale-110 shadow-glow"
              onClick={() => trackClick('cta-final', 'final-cta')}
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              今すぐラクコラを始める
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            🎉 登録は1分で完了！今すぐ始めちゃおう！
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;