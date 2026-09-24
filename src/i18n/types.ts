export type SupportedLanguage = 'en' | 'zh-HK' | 'zh-CN';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  description: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    label: 'English (UK)',
    nativeLabel: 'English (UK)',
    flag: '🇬🇧',
    description: 'Designed for UK schools (ParentPay, Year groups, £ GBP)',
  },
  {
    code: 'zh-HK',
    label: 'Traditional Chinese',
    nativeLabel: '繁體中文 (香港/海外)',
    flag: '🇭🇰',
    description: '香港家長習慣用語（長按相片、借走個名、係咪呢啲）',
  },
  {
    code: 'zh-CN',
    label: 'Simplified Chinese',
    nativeLabel: '简体中文',
    flag: '🇨🇳',
    description: '标准简体中文（长按分享、匿名脱敏、确认待办）',
  },
];
