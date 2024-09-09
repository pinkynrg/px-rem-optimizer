type RoundStrategy = {
  onTie: 'up' | 'down';
  mode: 'on' | 'off' | 'comment';
};

type Transformer = (value: string) => string;

type PropertyUnits = {
  [property: string]: 'px' | 'rem';
};

type SizeUnits = {
  px: string | null;
  rem: string | null;
};

type Sizes = {
  [key: string]: SizeUnits;
};

export type Config = {
  baseFontSize: number;
  targetPath: string;
  excludePaths: string[];
  roundStrategy: RoundStrategy;
  transformers: Transformer[];
  properties: PropertyUnits;
  sizes: Sizes;
};