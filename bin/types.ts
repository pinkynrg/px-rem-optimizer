type RoundStrategy = {
  onTie: 'up' | 'down';
  mode: 'on' | 'off' | 'comment';
};

type Transformer = (value: string) => string;

type PropertyConfig = {
  unit: 'rem' | 'px';
  getVariableName?: (sizeInPx: number) => string;
  transform?: boolean;
  convert?: boolean;
  round?: boolean;
}

type Properties = { [k: string]: PropertyConfig };

type Sizes = number[];

export type Config = {
  baseFontSize: number;
  targetPath: string;
  excludePaths: string[];
  targetExtensions: string[];
  roundStrategy: RoundStrategy;
  transformers: Transformer[];
  properties: Properties;
  sizesInPixel: Sizes;
  getGenericVariableName?: (sizeInPx: number) => string;
};