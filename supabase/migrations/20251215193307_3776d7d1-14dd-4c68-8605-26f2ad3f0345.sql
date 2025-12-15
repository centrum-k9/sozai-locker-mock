-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  twitter_handle TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, twitter_handle)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'user_name'),
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assets" 
ON public.assets FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own assets" 
ON public.assets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" 
ON public.assets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets" 
ON public.assets FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create friends table
CREATE TABLE public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_name TEXT NOT NULL,
  friend_avatar_url TEXT,
  friend_twitter_handle TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friends" 
ON public.friends FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add friends" 
ON public.friends FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friends" 
ON public.friends FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their friends" 
ON public.friends FOR DELETE USING (auth.uid() = user_id);

-- Create collabs table
CREATE TABLE public.collabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  platform TEXT,
  stream_url TEXT,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collabs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collabs" 
ON public.collabs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create collabs" 
ON public.collabs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collabs" 
ON public.collabs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collabs" 
ON public.collabs FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_collabs_updated_at
BEFORE UPDATE ON public.collabs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create collab_members table
CREATE TABLE public.collab_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collab_id UUID REFERENCES public.collabs(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES public.friends(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collab_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collab members of their collabs" 
ON public.collab_members FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.collabs WHERE id = collab_id AND user_id = auth.uid()));

CREATE POLICY "Users can add members to their collabs" 
ON public.collab_members FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.collabs WHERE id = collab_id AND user_id = auth.uid()));

CREATE POLICY "Users can remove members from their collabs" 
ON public.collab_members FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.collabs WHERE id = collab_id AND user_id = auth.uid()));

-- Create collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections" 
ON public.collections FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create collections" 
ON public.collections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" 
ON public.collections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" 
ON public.collections FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create collection_assets junction table
CREATE TABLE public.collection_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, asset_id)
);

ALTER TABLE public.collection_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collection assets" 
ON public.collection_assets FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND (user_id = auth.uid() OR is_public = true)));

CREATE POLICY "Users can add assets to their collections" 
ON public.collection_assets FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND user_id = auth.uid()));

CREATE POLICY "Users can remove assets from their collections" 
ON public.collection_assets FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND user_id = auth.uid()));

-- Create download_logs table
CREATE TABLE public.download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  downloader_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  downloader_name TEXT,
  downloader_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Asset owners can view download logs" 
ON public.download_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.assets WHERE id = asset_id AND user_id = auth.uid()));

CREATE POLICY "Anyone can log downloads" 
ON public.download_logs FOR INSERT WITH CHECK (true);

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies
CREATE POLICY "Users can upload their own assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own assets" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assets" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view public assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets');