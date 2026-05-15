// src/constants/matrix.ts

export const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

export const CHAR_SETS = {
  katakana: ALPHABET,
  latin: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  binary: '01',
  hex: '0123456789ABCDEF',
  braille:
    '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿',
  custom: '',
} as const;

export type CharSetType = keyof typeof CHAR_SETS;

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

export const ENGINE_CONSTANTS = {
  OPACITY_NORMAL: 0.35,
  OPACITY_SOLID: 1.0,
  DEFAULT_SQUARE_SIZE: 250,
  DEFAULT_TURNOVER_POINT: 10,
  EDGE_PADDING_NORMAL: 60,
  EDGE_PADDING_DISCO: 20,
  CANVAS_LARGE_THRESHOLD: 1000,
  X_WEST_MULTIPLIER: 1.5,
  X_WEST_OFFSET: 20,
  Y_NORTH_OFFSET: 2,
  Y_NORTH_MULTIPLIER: 2,
  Y_NORTH_MYSTERY_CONSTANT: 0.7021,
  Y_SOUTH_MULTIPLIER: 4,
  MAX_X_EAST_OFFSET: 1200,
  Y_NORTH_BOUNDARY_MULTIPLIER: 1.5,
  HANGING_WORD_SIZE_MULTIPLIER: 0.6,
  DEFAULT_WORD_SIZE_ALT: 80,
  FONT_SIZE_THRESHOLD_ALT: 40,
  CANVAS_HEIGHT_THRESHOLD_ALT: 2000,
  ALT_FADE_OFFSET_NORTH: 6,
  ALT_FADE_OFFSET_NORTH_BOTTOM: 14,
} as const;
