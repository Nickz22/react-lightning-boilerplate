export const ROUTER_PATH = {
  ALL_SEQUENCES: '/all-sequences',
  NEW_SEQUENCE: '/new-sequence',
} as const

// If updating colors, be sure to update sotrybook addon/knob patch as well
// /node_modules/@storybook/addon-knobs/dist/components/types/Color.js

export enum Colors {
  TRANSPARENT = 'transparent',

  // NEUTRAL
  N0 = '#FFFFFF',
  N10 = '#F7F7F7',
  N30 = '#EAEAEA',
  N40 = '#DBDBDB',
  N50 = '#CCCCCC',
  N70 = '#979797',
  N80 = '#5C5C5C',
  N90 = '#333333',
  N100 = '#000000',

  // COBALT
  C20 = '#99C2FF',
  C30 = '#66A3FF',
  C40 = '#3385FF',
  C50 = '#0066FF', // @NOTE: reserved for agents
  C60 = '#0052CC',
  C70 = '#003D99',
  C80 = '#002966',

  // COBALT GREY <-- added because these colors being used by material-ui theme
  CG60 = '#546e7a',
  CG90 = '#263238',

  // PURPLE
  P20 = '#C8B6F7',
  P30 = '#AC92F2',
  P40 = '#916DEE', // @NOTE: reserved for clients / users other than agents
  P50 = '#7549EA',
  P60 = '#5E3ABB',
  P70 = '#462C8C',
  P80 = '#2F1D5E',

  // POPPY
  PY20 = '#FFD6AD',
  PY30 = '#FFC285',
  PY40 = '#FFAD5C',
  PY50 = '#FF9933',
  PY60 = '#CC7A29',
  PY70 = '#995C1F',
  PY80 = '#663D14',

  // VERDANT
  V20 = '#ADEBD6',
  V30 = '#85E0C2',
  V40 = '#5CD6AD',
  V50 = '#33CC99',
  V60 = '#29A37A',
  V70 = '#1F7A5C',
  V80 = '#14523D',

  // SUNBURST
  S20 = '#FEEFAE',
  S30 = '#FEE886',
  S40 = '#FDE05D',
  S50 = '#FDD835',
  S60 = '#CAAD2A',
  S70 = '#988220',
  S80 = '#655615',

  // FLAME
  F20 = '#FFB5B5',
  F30 = '#FF8F8F',
  F40 = '#FF6A6A',
  F50 = '#FF4545',
  F60 = '#CC3737',
  F70 = '#992929',
  F80 = '#661C1C',

  // SAGE
  SG20 = '#A4B8B9',
  SG30 = '#779497',
  SG40 = '#497174',
  SG50 = '#1C4D51',
  SG60 = '#163E41',
  SG70 = '#112E31',
  SG80 = '#0B1F20',

  BLACK = N100,
  GREY = N70,
  MID_GREY = N50,
  LIGHT_GREY = N30,
  LIGHTER_GREY = N10,
  TRANSPARENT_GREY = 'rgba(0,0,0,.05)',
  WHITE = N0,

  BLUE = C50,
  PURPLE = P50,
  GREEN = V50,
  ORANGE = PY50,
  YELLOW = S50,
  RED = F50,
  SAGE = SG50,

  // colors that aren't in the plasma

  // GREEN <- for Toggle Switch
  G20 = '#6fc96f',
  G40 = '#5cb85c',
  G60 = '#449d44',

  // RED <- for Toggle Switch
  R20 = '#d9534f',
  R40 = '#c9302c',
  R60 = '#ac2925',

  DARK_PURPLE = '#3F3996',
  MIDNIGHT = '#003A7F',
  SKY = '#80B4FF',
  LAVENDAR = '#CBC0FF',
}

export enum ThemePalette {
  PRIMARY = Colors.BLUE,
  NEUTRAL = Colors.LIGHT_GREY,
  NEUTRAL_DARK = Colors.MID_GREY,
  NEUTRAL_LIGHT = Colors.LIGHTER_GREY,
  SUCCESS = Colors.GREEN,
  ERROR = Colors.RED,
}
