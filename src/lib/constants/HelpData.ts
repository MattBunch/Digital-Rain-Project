export interface HelpItem {
  key: string;
  description: string;
}

export interface HelpGroup {
  title: string;
  items: HelpItem[];
}

export const helpGroups: HelpGroup[] = [
  {
    title: 'NORMAL_MODE',
    items: [
      { key: 'Arrows', description: 'Switch directions' },
      { key: 'Space', description: 'Pause' },
      { key: 'C', description: 'Clear screen' },
      { key: 'D', description: 'Toggle disco' },
      { key: 'W', description: 'Increase font size' },
      { key: 'S', description: 'Decrease font size' },
      { key: 'Q', description: 'Increase string length' },
      { key: 'A', description: 'Decrease string length' },
      { key: 'R', description: 'Toggle rapid word change' },
      { key: 'M', description: 'Switch between modes' },
      { key: 'PageUp', description: 'Speed up' },
      { key: 'PageDown', description: 'Slow down' },
      { key: '1-8', description: 'Change colors' },
      { key: 'Esc', description: 'Quit to menu' },
    ],
  },
  {
    title: 'SQUARE_MODE',
    items: [
      { key: 'Arrows', description: 'Move box directions' },
      { key: 'G', description: 'Toggle fixed word length' },
      { key: 'P', description: 'Increase random square speed' },
      { key: ';', description: 'Decrease random square speed' },
    ],
  },
];
