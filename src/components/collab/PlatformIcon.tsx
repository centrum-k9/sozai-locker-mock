import { Youtube, Twitch, Play, MonitorPlay } from 'lucide-react';

interface PlatformIconProps {
  platform: 'YouTube' | 'Twitch' | 'Niconico' | 'Other';
  size?: number;
}

export const PlatformIcon = ({ platform, size = 16 }: PlatformIconProps) => {
  const iconProps = { size };

  switch (platform) {
    case 'YouTube':
      return <Youtube {...iconProps} className="text-red-600" />;
    case 'Twitch':
      return <Twitch {...iconProps} className="text-purple-600" />;
    case 'Niconico':
      return <Play {...iconProps} className="text-orange-600" />;
    case 'Other':
    default:
      return <MonitorPlay {...iconProps} className="text-blue-600" />;
  }
};