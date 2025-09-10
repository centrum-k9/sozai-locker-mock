import { TextPattern, toXMention, toXHashtag } from '../types';
import { Friend } from '../types';

export interface TextGenerationOptions {
  pattern: TextPattern;
  members: Friend[];
  eventTitle?: string;
  customTemplate?: string;
}

export const generateCollabText = (options: TextGenerationOptions): string => {
  const { pattern, members, eventTitle } = options;
  
  if (members.length === 0) return '';
  
  switch (pattern) {
    case 'overview':
      return generateOverviewText(members, eventTitle);
    case 'announcement-a':
      return generateAnnouncementA(members, eventTitle);
    case 'announcement-b':
      return generateAnnouncementB(members, eventTitle);
    default:
      return '';
  }
};

// パターン1: 概要欄（名前 + YouTube URL + X URL）
const generateOverviewText = (members: Friend[], eventTitle?: string): string => {
  const lines: string[] = [];
  
  if (eventTitle) {
    lines.push(`🎥 ${eventTitle}`);
    lines.push('');
  }
  
  lines.push('📋 出演者:');
  
  members.forEach(member => {
    const memberLines: string[] = [];
    memberLines.push(`・${member.displayName}`);
    
    if (member.youtubeUrl) {
      memberLines.push(`  YouTube: ${member.youtubeUrl}`);
    }
    
    if (member.xHandle) {
      const xUrl = `https://x.com/${member.xHandle}`;
      memberLines.push(`  X: ${xUrl}`);
    }
    
    lines.push(...memberLines);
  });
  
  return lines.join('\n');
};

// パターン2: 告知A（名前 + @メンション、改行区切り）
const generateAnnouncementA = (members: Friend[], eventTitle?: string): string => {
  const lines: string[] = [];
  
  if (eventTitle) {
    lines.push(`🎉 ${eventTitle}`);
    lines.push('');
  }
  
  lines.push('🎪 コラボメンバー:');
  
  members.forEach(member => {
    let line = `・${member.displayName}`;
    if (member.xHandle) {
      line += ` ${toXMention(member.xHandle)}`;
    }
    lines.push(line);
  });
  
  return lines.join('\n');
};

// パターン3: 告知B（名前 + #ハッシュタグ、改行区切り）
const generateAnnouncementB = (members: Friend[], eventTitle?: string): string => {
  const lines: string[] = [];
  
  if (eventTitle) {
    lines.push(`✨ ${eventTitle}`);
    lines.push('');
  }
  
  lines.push('🏷️ 参加者:');
  
  members.forEach(member => {
    let line = `・${member.displayName}`;
    if (member.xHandle) {
      line += ` ${toXHashtag(member.xHandle)}`;
    }
    lines.push(line);
  });
  
  return lines.join('\n');
};

// 文字数カウント（改行を考慮）
export const countCharacters = (text: string): number => {
  return text.length;
};

// Twitter文字数制限チェック
export const isWithinTwitterLimit = (text: string): boolean => {
  return countCharacters(text) <= 280;
};

// テンプレート説明文
export const getPatternDescription = (pattern: TextPattern): string => {
  switch (pattern) {
    case 'overview':
      return '配信概要欄用のテキストを生成します（名前・YouTube・Xのリンク付き）';
    case 'announcement-a':
      return 'SNS告知用テキストを生成します（@メンション付き、改行区切り）';
    case 'announcement-b':
      return 'SNS告知用テキストを生成します（#ハッシュタグ付き、改行区切り）';
    default:
      return '';
  }
};

export const getPatternLabel = (pattern: TextPattern): string => {
  switch (pattern) {
    case 'overview':
      return '概要欄用';
    case 'announcement-a':
      return '告知A (@メンション)';
    case 'announcement-b':
      return '告知B (#ハッシュタグ)';
    default:
      return '';
  }
};