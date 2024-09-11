import path from "path";
import fs from "fs";
import { optimizeValue, transformCSSFileContent } from "../utils";
import { config } from "./config";
import { Config } from "../types";

const customTransformer: Config = {
  ...config,
  transformers: [
    (value: string) => {
      return value.replace(/to-rem\((-?\d+(\.\d+)?(px|rem))\)/g, (_, target) => {
        return target;
      });
    }
  ],
};

const roundingDisabled: Config = {
  ...config,
  roundStrategy: {
    mode: 'comment',
    onTie: 'up',
  },
};

const withVariables: Config = {
  ...config,
  getGenericVariableName: (sizeInPx: number) => {
    return `--space-${sizeInPx/4}`;
  },
  properties: {
    ...config.properties,
    'border': {
      unit: 'px',
      getVariableName: (sizeInPx: number) => {
        return `--border-${sizeInPx}`;
      }
    },
    'margin': {
      unit: 'px',
      getVariableName: (sizeInPx: number) => {
        return `@margin-${sizeInPx}`;
      }
    }
  }
}

const roundingDisabledWithVariables: Config = {
  ...config,
  getGenericVariableName: (sizeInPx: number) => {
    return `--space-${sizeInPx/4}`;
  },
  roundStrategy: {
    mode: 'comment',
    onTie: 'up',
  },
};


describe('optimizeValue function', () => {
  const testCases: [string, string, Config, string][] = [
    ['width', '0px', config, '0rem'],
    ['border', '0px', config, '0px'],
    ['width', '16px', config, '1rem'],
    ['width', '-16px', config, '-1rem'],
    ['width', '-15px', config, '-1rem'],
    ['border', '0.125rem', config, '2px'],
    ['border', '-0.125rem', config, '-2px'],
    ['border', '.125rem', config, '2px'],
    ['border', '1.6px', config, '2px'],
    ['border', '1.5px /* tofix 2px */', config, '2px'],
    ['padding', 'to-rem(16px)', customTransformer, '16px'],
    ['width', 'to-rem(16px)', customTransformer, '1rem'],
    ['padding', 'to-rem(-16px)', customTransformer, '-16px'],
    ['width', 'to-rem(-16px)', customTransformer, '-1rem'],
    ['margin', '1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */', customTransformer, '2px 2px 2px 2px'],
    ['margin', '1.6px /* tofix var(--some-var) */ 1.6px /* tofix var(--some-var) */ 1.6px /* tofix var(--some-var) */ 1.6px /* tofix var(--some-var) */', customTransformer, '2px 2px 2px 2px'],
    ['margin', '1.6px 1.6px 1.6px 1.6px', roundingDisabled, '1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */'],
    ['margin', '1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */', roundingDisabled, '1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */ 1.6px /* tofix 2px */'],
    ['border', '1.6px', roundingDisabled, '1.6px /* tofix 2px */'],
    ['border', '1.5px', roundingDisabled, '1.5px /* tofix 2px */'],
    ['border', '1.4px', roundingDisabled, '1.4px /* tofix 1px */'],
    ['border', '-1.6px', roundingDisabled, '-1.6px /* tofix -2px */'],
    ['border', '-1.5px', roundingDisabled, '-1.5px /* tofix -1px */'],
    ['border', '-1.4px', roundingDisabled, '-1.4px /* tofix -1px */'],
    ['width', '16px', roundingDisabled, '1rem'],
    ['width', '15px', roundingDisabled, '0.9375rem /* tofix 1rem */'],
    ['width', '14px', roundingDisabled, '0.875rem /* tofix 1rem */'],
    ['width', '-16px', roundingDisabled, '-1rem'],
    ['width', '-15px', roundingDisabled, '-0.9375rem /* tofix -1rem */'],
    ['width', '-14px', roundingDisabled, '-0.875rem /* tofix -0.75rem */'],
    ['width', '16px', roundingDisabledWithVariables, 'var(--space-4)'],
    ['border', '-1.6px /* tofix -2000px */', roundingDisabled, '-1.6px /* tofix -2px */'],
    ['border', '-1.6px /* tofix var(-1 * --somevariable) */', roundingDisabled, '-1.6px /* tofix -2px */'],
    ['width', '16px', config, '1rem'],
    ['grid-template-rows', 'min-content min-content auto to-rem(60px);', customTransformer, 'min-content min-content auto 4rem;'],
    ['border', '0.0625rem 0.0625rem 0.0625rem 0.0625rem;', config, '1px 1px 1px 1px;'],
    ['border', '1px 0.0625rem 1px 0.0625rem;', config, '1px 1px 1px 1px;'],
    ['width', '15px', roundingDisabled, '0.9375rem /* tofix 1rem */'],
    ['grid-template-rows', 'min-content min-content auto 60px;', roundingDisabled, 'min-content min-content auto 3.75rem /* tofix 4rem */;'],
    ['width', 'to-rem(16px);', customTransformer, '1rem;'],
    ['width', 'to-rem(-16px);', customTransformer, '-1rem;'],
    ['padding', 'to-rem(4px) to-rem(8px) to-rem(16px) to-rem(32px);', customTransformer, '4px 8px 16px 32px;'],
    ['padding', '1rem 2rem 3rem 4rem;', customTransformer, '16px 32px 48px 64px;'],
    ['translate', 'to-rem(30px) to-rem(-22px);', customTransformer, '2rem -1.25rem;'],
    ['grid-template-columns', 'to-rem(16px) calc(100% - to-rem(16px));', customTransformer, '1rem calc(100% - 1rem);'],
    ['border', '0.0625rem;', withVariables, 'var(--border-1);'],
    ['border', '-0.0625rem;', withVariables, 'calc(-1 * var(--border-1));'],
    ['margin', '0.125rem;', withVariables, '@margin-2;'],
    ['margin', '-0.125rem;', withVariables, '(-@margin-2);'],
    ['width', '16px;', withVariables, 'var(--space-4);']
  ];

  testCases.forEach(([property, value, configType, expected]) => {
    test(`${property}: ${value} => ${expected}`, () => {
      expect(optimizeValue(property, value, configType)).toBe(expected);
    });
  });
});

describe('transformCSSFileContent function', () => {
  ['1', '2'].forEach((e) => {
    test(`test file ${e}`, () => {
      const sourceContent = fs.readFileSync(path.resolve(__dirname, `./${e}-source.scss`), 'utf8');
      const destinationContent = fs.readFileSync(path.resolve(__dirname, `./${e}-destination.scss`), 'utf8');
      expect(transformCSSFileContent(sourceContent, customTransformer)).toBe(destinationContent);
    });
  })
});
