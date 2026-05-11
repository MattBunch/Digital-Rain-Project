// src/constants/matrix.ts

export const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

export const COLORS = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  MATRIX_GREEN: '#00ff41',
  GREEN_VARIANTS: ['#ccffd9', '#80ff9f', '#00ff41'],
  RED_VARIANTS: ['#ffcccc', '#ff6666', '#e60000'],
  YELLOW_VARIANTS: ['#ffffe6', '#ffff66', '#ffff00'],
  BLUE_VARIANTS: ['#e6e6ff', '#6666ff', '#0000ff'],
  ORANGE_VARIANTS: ['#fff5e6', '#ffc266', '#ff9900'],
  PINK_VARIANTS: ['#ffe6ff', '#ff66ff', '#ff00ff'],
  CYAN_VARIANTS: ['#e6ffff', '#66ffff', '#00ffff'],
};

export const DEFAULT_CONFIG = {
  FONT_SIZE: 20,
  SPEED: 50,
  STRING_SIZE_MIN: 20,
  STRING_SIZE_MAX: 48,
};

export const DIRECTIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;
