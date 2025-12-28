import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star,
  FileImage,
  Link2,
  Download,
  MessageSquare,
  Users,
  Monitor,
  History,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';

// Feature images
import featureAssetSharing from '@/assets/feature-asset-sharing.png';
import featureDescriptionCreator from '@/assets/feature-description-creator.png';
import featureDiscordOverlay from '@/assets/feature-discord-overlay.png';

export const Landing = () => {
  const { trackPageView, trackClick } = useAnalytics();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    trackPageView('landing');
  }, [trackPageView]);

  const painPoints = [
    '立ち絵、どれ使うか毎回探してる',
    '概要欄、前のコピペどこだっけ？',
    'OBSのオーバーレイ、また設定し直し',
    'コラボ相手の情報、探しに行くのが地味に面倒',
  ];

  const featureSlides = [
    {
      image: featureAssetSharing,
      title: '素材共有',
      description: '立ち絵やKVをURLで簡単共有',
      icon: FileImage,
    },
    {
      image: featureDescriptionCreator,
      title: '概要欄作成',
      description: 'コラボ情報から概要欄を自動生成',
      icon: FileText,
    },
    {
      image: featureDiscordOverlay,
      title: 'Discordオーバーレイ',
      description: '通話メンバーをOBSに表示',
      icon: Monitor,
    },
  ];

  const steps = [
    {
      number: 1,
      title: '素材を置く',
      description: '立ち絵・キービジュアルをアップロード。URLで共有できる状態に。',
    },
    {
      number: 2,
      title: 'コラボ相手とまとめる',
      description: 'コラボ相手の情報、概要欄用テキスト、使う素材をひとまとめ。',
    },
    {
      number: 3,
      title: 'URLを渡すだけ',
      description: '素材のDL先、概要欄、OBS用オーバーレイ。全部まとまってる。',
    },
  ];

  const capabilities = [
    { icon: FileImage, text: '立ち絵やKVを、URLで共有できる' },
    { icon: Download, text: '誰が素材をDLしたかわかる' },
    { icon: Users, text: 'コラボ相手の情報を探さなくていい' },
    { icon: Monitor, text: 'Discord通話のメンバーをそのままOBSに表示できる' },
    { icon: History, text: '過去にコラボした相手の素材をすぐ探せる' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 opacity-20">
          <Star className="w-8 h-8 text-accent fill-accent animate-bounce-slow" />
        </div>
        <div className="absolute top-32 right-16 opacity-20">
          <Sparkles className="w-10 h-10 text-primary animate-bounce-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-15">
          <Star className="w-6 h-6 text-primary fill-primary animate-bounce-slow" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <Badge 
                variant="secondary" 
                className="mb-6 bg-accent text-accent-foreground shadow-sm inline-flex items-center gap-2 animate-wiggle"
              >
                <Sparkles className="w-4 h-4" />
                これはラク！
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-foreground">コラボの準備を楽に、</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  コラボ配信を楽しく。
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                素材共有・概要欄作成・Discordオーバーレイ、
                <br />
                コラボ配信に必要なものの準備が全部ラクチン！
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                  <Button 
                    size="lg" 
                    className="hero-gradient hover:opacity-90 transition-all duration-300 group text-lg px-8"
                    onClick={() => trackClick('cta-start', 'hero')}
                  >
                    無料で始める
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 border-2"
                    onClick={() => trackClick('demo-link', 'hero')}
                  >
                    デモを使ってみる
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right: Feature Carousel */}
            <div className="hidden lg:block">
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {featureSlides.map((slide, index) => {
                      const Icon = slide.icon;
                      return (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="overflow-hidden border-border/50 shadow-lg">
                              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                              </div>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg">{slide.title}</h3>
                                    <p className="text-sm text-muted-foreground">{slide.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
                
                {/* Floating badge */}
                <div className="absolute -top-4 right-8 animate-float z-10">
                  <Badge className="bg-accent text-accent-foreground shadow-md">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    準備完了！
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empathy Section */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            配信前、こんなことありませんか？
          </h2>
          
          <div className="space-y-4 mb-10">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 bg-background rounded-xl px-6 py-4 shadow-sm border border-border/30"
              >
                <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>
          
          {/* Transition */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary/30" />
              <Badge 
                variant="secondary" 
                className="bg-accent text-accent-foreground shadow-sm text-base px-6 py-2 my-4"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                これはラク！
              </Badge>
              <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
            </div>
            
            <p className="text-xl md:text-2xl font-bold text-foreground mt-6">
              ラクコラは、
              <br />
              その「めんどう」をまとめます。
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              コラボ配信の準備、こう変わります
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="h-full border-0 shadow-md bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full hero-gradient flex items-center justify-center text-white text-xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
                
                {/* Raku badge */}
                {index === 2 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground text-xs shadow-sm">
                      これはラク！
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 md:py-20 px-4 bg-muted/20">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              ラクコラでできること
            </h2>
          </div>

          <div className="space-y-4">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 bg-background rounded-xl px-6 py-5 shadow-sm border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section (Light) */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            無料でも使えます。
            <br />
            <span className="text-muted-foreground font-normal text-xl">たくさん使うなら、もっとラクに。</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {/* Free */}
            <Card className="border border-border/50 shadow-sm">
              <CardContent className="p-6 text-left">
                <h3 className="font-bold text-lg mb-4">無料</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>素材・リストに上限あり</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>セキュリティ機能は全て使える</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Paid */}
            <Card className="border-2 border-primary/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                  おすすめ
                </Badge>
              </div>
              <CardContent className="p-6 text-left">
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="font-bold text-lg">有料</h3>
                  <span className="text-2xl font-bold text-primary">¥480</span>
                  <span className="text-muted-foreground text-sm">/月</span>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>素材数 無制限</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>リスト数 無制限</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>過去のコラボを消さなくていい</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-muted-foreground mt-8 text-lg">
            コラボが増えてきたら、
            <br />
            「消さなくてよくなる」のが有料です。
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            コラボ配信の準備、
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              もう悩まなくていい。
            </span>
          </h2>
          
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button 
              size="lg" 
              className="hero-gradient hover:opacity-90 transition-all duration-300 group text-lg px-10 py-6"
              onClick={() => trackClick('cta-final', 'cta')}
            >
              無料でラクコラを使ってみる
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <div className="mt-6">
            <Badge variant="secondary" className="bg-accent/50 text-accent-foreground">
              <Sparkles className="w-3 h-3 mr-1" />
              これはラク！
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
