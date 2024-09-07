import path from "path";
import fs from "fs";
import { optimizeValue, transformCSSFileContent } from "../utils";
import { config as basicConfig } from "../config";

const customTransformer = {
  ...basicConfig,
  transformers: [
    (value: string) => {
      return value.replace(/to-rem\((-?\d+(\.\d+)?(px|rem))\)/g, (_, target) => {
        return target;
      });
    }
  ],
};

const roundingDisabled = {
  ...basicConfig,
  roundStrategy: {
    mode: 'comment',
    onTie: 'up',
  },
};

test('optimizeValue function', () => {
  expect(optimizeValue('width', '0px', basicConfig)).toBe('0rem');
  expect(optimizeValue('border', '0px', basicConfig)).toBe('0px');
  expect(optimizeValue('width', '16px', basicConfig)).toBe('1rem');
  expect(optimizeValue('width', '-16px', basicConfig)).toBe('-1rem');
  expect(optimizeValue('width', '-15px', basicConfig)).toBe('-1rem');
  expect(optimizeValue('border', '0.125rem', basicConfig)).toBe('2px');
  expect(optimizeValue('border', '-0.125rem', basicConfig)).toBe('-2px');
  expect(optimizeValue('border', '.125rem', basicConfig)).toBe('2px');
  expect(optimizeValue('border', '1.6px', basicConfig)).toBe('2px');
  expect(optimizeValue('border', '1.5px', basicConfig)).toBe('2px');
  expect(optimizeValue('padding', 'to-rem(16px)', customTransformer)).toBe('16px');
  expect(optimizeValue('width', 'to-rem(16px)', customTransformer)).toBe('1rem');
  expect(optimizeValue('padding', 'to-rem(-16px)', customTransformer)).toBe('-16px');
  expect(optimizeValue('width', 'to-rem(-16px)', customTransformer)).toBe('-1rem');
  expect(optimizeValue('border', '1.6px', roundingDisabled)).toBe('1.6px /* tofix 2px */');
  expect(optimizeValue('border', '1.5px', roundingDisabled)).toBe('1.5px /* tofix 2px */');
  expect(optimizeValue('border', '1.4px', roundingDisabled)).toBe('1.4px /* tofix 1px */');
  expect(optimizeValue('border', '-1.6px', roundingDisabled)).toBe('-1.6px /* tofix -2px */');
  expect(optimizeValue('border', '-1.5px', roundingDisabled)).toBe('-1.5px /* tofix -1px */');
  expect(optimizeValue('border', '-1.4px', roundingDisabled)).toBe('-1.4px /* tofix -1px */');
  expect(optimizeValue('width', '16px', roundingDisabled)).toBe('1rem');
  expect(optimizeValue('width', '15px', roundingDisabled)).toBe('0.9375rem /* tofix 1rem */');
  expect(optimizeValue('width', '14px', roundingDisabled)).toBe('0.875rem /* tofix 1rem */');
  expect(optimizeValue('width', '-16px', roundingDisabled)).toBe('-1rem');
  expect(optimizeValue('width', '-15px', roundingDisabled)).toBe('-0.9375rem /* tofix -1rem */');
  expect(optimizeValue('width', '-14px', roundingDisabled)).toBe('-0.875rem /* tofix -0.75rem */');
  expect(optimizeValue('width', '16px', basicConfig)).toBe('1rem');
  expect(optimizeValue('grid-template-rows', 'min-content min-content auto to-rem(60px);', customTransformer)).toBe('min-content min-content auto 4rem;');
  expect(optimizeValue('border', '0.0625rem 0.0625rem 0.0625rem 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(optimizeValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(optimizeValue('width', '15px', roundingDisabled)).toBe('0.9375rem /* tofix 1rem */');
  expect(optimizeValue('grid-template-rows', 'min-content min-content auto 60px;', roundingDisabled)).toBe('min-content min-content auto 3.75rem /* tofix 4rem */;');
  expect(optimizeValue('width', 'to-rem(16px);', customTransformer)).toBe('1rem;');
  expect(optimizeValue('width', 'to-rem(-16px);', customTransformer)).toBe('-1rem;');
  expect(optimizeValue('padding', 'to-rem(4px) to-rem(8px) to-rem(16px) to-rem(32px);', customTransformer)).toBe('4px 8px 16px 32px;');
  expect(optimizeValue('padding', '1rem 2rem 3rem 4rem;', customTransformer)).toBe('16px 32px 48px 64px;');
  expect(optimizeValue('translate', 'to-rem(30px) to-rem(-22px);', customTransformer)).toBe('2rem -1.25rem;');
  expect(optimizeValue('grid-template-columns', 'to-rem(16px) calc(100% - to-rem(16px));', customTransformer)).toBe('1rem calc(100% - 1rem);');
});

describe('transformCSSFileContent function', () => {
  ['1'].forEach((e) => {
    test(`test file ${e}`, () => {
      const sourceContent = fs.readFileSync(path.resolve(__dirname, `./${e}-source.scss`), 'utf8');
      const destinationContent = fs.readFileSync(path.resolve(__dirname, `./${e}-destination.scss`), 'utf8');
      expect(transformCSSFileContent(sourceContent, customTransformer)).toBe(destinationContent);
    });
  })
});
