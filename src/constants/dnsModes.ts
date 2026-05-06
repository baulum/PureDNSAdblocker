export type DnsMode = 'Normal' | 'Clean' | 'Hard' | 'Blank';

export type DnsModeConfig = {
  mode: DnsMode;
  label: string;
  subtitle: string;
  description: string;
  dns: string[];
  accentColor: string;
  icon: string; // emoji shorthand for icon selection
};

export const DNS_MODES: DnsModeConfig[] = [
  {
    mode: 'Normal',
    label: 'mode_normal_label',
    subtitle: 'mode_normal_subtitle',
    description: 'mode_normal_desc',
    dns: ['49.12.67.122', '91.99.154.175', '176.9.93.198', '176.9.1.117'],
    accentColor: '#4FACFE',
    icon: 'shield',
  },
  {
    mode: 'Clean',
    label: 'mode_clean_label',
    subtitle: 'mode_clean_subtitle',
    description: 'mode_clean_desc',
    dns: ['49.12.223.2', '49.12.43.208'],
    accentColor: '#43E97B',
    icon: 'family',
  },
  {
    mode: 'Hard',
    label: 'mode_hard_label',
    subtitle: 'mode_hard_subtitle',
    description: 'mode_hard_desc',
    dns: ['49.12.222.213', '88.198.122.154'],
    accentColor: '#FA709A',
    icon: 'lock',
  },
  {
    mode: 'Blank',
    label: 'mode_blank_label',
    subtitle: 'mode_blank_subtitle',
    description: 'mode_blank_desc',
    dns: ['138.199.149.249', '78.47.71.194'],
    accentColor: '#A18CD1',
    icon: 'globe',
  },
];

export const getModeConfig = (mode: DnsMode): DnsModeConfig =>
  DNS_MODES.find(m => m.mode === mode)!;
