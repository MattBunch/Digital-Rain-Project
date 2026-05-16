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
    title: 'CONTROLS',
    items: [
      { key: 'Arrows', description: 'Cardinal directions / Move box' },
      { key: 'Y/U/B/N', description: 'Diagonal directions' },
      { key: 'Space', description: 'Pause' },
      { key: 'C', description: 'Clear screen' },
      { key: 'D', description: 'Toggle disco' },
      { key: 'W/S', description: 'Font size' },
      { key: 'Q/A', description: 'String length' },
      { key: 'R', description: 'Toggle rapid word change' },
      { key: 'M', description: 'Switch mode' },
      { key: 'F', description: 'Toggle FPS counter' },
      { key: 'T', description: "Toggle 'All 4 Directions' mode" },
      { key: 'Shift+T', description: "Toggle 'All 8 Directions' mode" },
      { key: 'PgUp/Dn', description: 'Change speed' },
      { key: '1-8', description: 'Change color' },
      { key: 'Esc', description: 'Quit to menu' },
    ],
  },
];
