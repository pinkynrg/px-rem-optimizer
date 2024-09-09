type RoundStrategy = {
  onTie: 'up' | 'down';
  mode: 'on' | 'off' | 'comment';
};

type Transformer = (value: string) => string;

type PropertyUnits = {
  [property: string]: {
    unit: 'rem' | 'px' | 'skip';
    getVariableName?: (sizeInPx: number) => string;
  }
};

type Sizes = number[];

export type Config = {
  baseFontSize: number;
  targetPath: string;
  excludePaths: string[];
  roundStrategy: RoundStrategy;
  transformers: Transformer[];
  properties: PropertyUnits;
  sizesInPixel: Sizes;
  getGenericVariableName?: (sizeInPx: number) => string;
};