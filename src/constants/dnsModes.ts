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
    label: 'Normal',
    subtitle: 'Mit Werbeblocker',
    description:
      'Mit ausgewogenen Blocklisten surfst du schnell, werbefrei, ohne Tracking und geschützt vor Malware durchs Internet.',
    dns: ['49.12.67.122', '91.99.154.175', '176.9.93.198', '176.9.1.117'],
    accentColor: '#4FACFE',
    icon: 'shield',
  },
  {
    mode: 'Clean',
    label: 'Clean',
    subtitle: 'Normal + Jugendschutz',
    description:
      'Mit erweiterten Jugendschutz-Blocklisten sowie aktivierter SafeSearch-Funktion bei Suchmaschinen und YouTube für ein sicheres und altersgerechtes Surferlebnis.',
    dns: ['49.12.223.2', '49.12.43.208'],
    accentColor: '#43E97B',
    icon: 'family',
  },
  {
    mode: 'Hard',
    label: 'Hard',
    subtitle: 'Normal + strenge Regeln',
    description:
      'Mit besonders strengen Blocklisten für maximalen Schutz – dadurch können einzelne Funktionen eingeschränkt sein. Es werden keinerlei Ausnahmen (Whitelists) zugelassen.',
    dns: ['49.12.222.213', '88.198.122.154'],
    accentColor: '#FA709A',
    icon: 'lock',
  },
  {
    mode: 'Blank',
    label: 'Blank',
    subtitle: 'Kein Filter',
    description:
      'Keine Blockierung aktiv. Nutzt saubere DNS-Server ohne Filterlisten – voller Internetzugang ohne Einschränkungen.',
    dns: ['138.199.149.249', '78.47.71.194'],
    accentColor: '#A18CD1',
    icon: 'globe',
  },
];

export const getModeConfig = (mode: DnsMode): DnsModeConfig =>
  DNS_MODES.find(m => m.mode === mode)!;
