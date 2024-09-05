import path from "path";
import fs from "fs";
import { transformBasicValue, transformComplexValue, transformCSSFileContent } from "../utils";
import basicConfig from "../config.json";

describe('transformBasicValue function', () => {
  test('transforms 0px to 0rem and 0px to itself', () => {
    expect(transformBasicValue('0px', 'rem')).toBe('0rem');
    expect(transformBasicValue('0px', 'px')).toBe('0px');
  });

  test('transforms positive and negative px to rem', () => {
    expect(transformBasicValue('16px', 'rem')).toBe('1rem');
    expect(transformBasicValue('-16px', 'rem')).toBe('-1rem');
    expect(transformBasicValue('-15px', 'rem')).toBe('-1rem');
  });

  test('transforms rem to px', () => {
    expect(transformBasicValue('0.125rem', 'px')).toBe('2px');
    expect(transformBasicValue('-0.125rem', 'px')).toBe('-2px');
    expect(transformBasicValue('.125rem', 'px')).toBe('2px');
  });

  test('rounds px values correctly', () => {
    expect(transformBasicValue('1.6px', 'px')).toBe('2px');
    expect(transformBasicValue('1.5px', 'px')).toBe('2px');
  });

  describe('with custom regex rules', () => {
    const newConfigWithCustomRegex = {
      ...basicConfig,
      lengthMatchingRules: {
        ...basicConfig.lengthMatchingRules,
        'px': "(\\-?\\d+(\\.\\d+)?|\\.\\d+)px|to-rem\\((\\-?\\d+(\\.\\d+)?|\\.\\d+)px\\)",
      },
    };

    test('applies custom regex transformations', () => {
      expect(transformBasicValue('to-rem(16px)', 'px', newConfigWithCustomRegex)).toBe('16px');
      expect(transformBasicValue('to-rem(16px)', 'rem', newConfigWithCustomRegex)).toBe('1rem');
      expect(transformBasicValue('to-rem(-16px)', 'px', newConfigWithCustomRegex)).toBe('-16px');
      expect(transformBasicValue('to-rem(-16px)', 'rem', newConfigWithCustomRegex)).toBe('-1rem');
    });
  });

  describe('with rounding disabled', () => {
    const newConfigWithRoundingDisabled = {
      ...basicConfig,
      round: {
        ...basicConfig.round,
        enabled: false,
      },
    };

    test('handles rounding when disabled', () => {
      expect(transformBasicValue('1.6px', 'px', newConfigWithRoundingDisabled)).toBe('1.6px /* tofix: 2px */');
      expect(transformBasicValue('1.5px', 'px', newConfigWithRoundingDisabled)).toBe('1.5px /* tofix: 2px */');
      expect(transformBasicValue('1.4px', 'px', newConfigWithRoundingDisabled)).toBe('1.4px /* tofix: 1px */');
      expect(transformBasicValue('-1.6px', 'px', newConfigWithRoundingDisabled)).toBe('-1.6px /* tofix: -2px */');
      expect(transformBasicValue('-1.5px', 'px', newConfigWithRoundingDisabled)).toBe('-1.5px /* tofix: -1px */');
      expect(transformBasicValue('-1.4px', 'px', newConfigWithRoundingDisabled)).toBe('-1.4px /* tofix: -1px */');
    });
  });
});

describe('transformComplexValue function', () => {
  test('transforms width from px to rem', () => {
    expect(transformComplexValue('width', '16px;', basicConfig)).toBe('1rem;');
  });

  test('transforms border values from rem to px', () => {
    expect(transformComplexValue('border', '0.0625rem 0.0625rem 0.0625rem 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  });

  test('transforms border with mixed px and rem values', () => {
    expect(transformComplexValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  });

  describe('with custom regex rules', () => {
    const newConfig = {
      ...basicConfig,
      lengthMatchingRules: {
        ...basicConfig.lengthMatchingRules,
        'px': "(\\-?\\d+(\\.\\d+)?|\\.\\d+)px|to-rem\\((\\-?\\d+(\\.\\d+)?|\\.\\d+)px\\)",
      },
    };

    test('applies custom regex transformations', () => {
      expect(transformComplexValue('width', 'to-rem(16px);', newConfig)).toBe('1rem;');
      expect(transformComplexValue('width', 'to-rem(-16px);', newConfig)).toBe('-1rem;');
      expect(transformComplexValue('padding', 'to-rem(4px) to-rem(8px) to-rem(16px) to-rem(32px);', newConfig)).toBe('4px 8px 16px 32px;');
      expect(transformComplexValue('padding', '1rem 2rem 3rem 4rem;', newConfig)).toBe('16px 32px 48px 64px;');
      expect(transformComplexValue('translate', 'to-rem(30px) to-rem(-22px);', newConfig)).toBe('2rem -1.25rem;');
      expect(transformComplexValue('grid-template-columns', 'to-rem(16px) calc(100% - to-rem(16px));', newConfig)).toBe('1rem calc(100% - 1rem);');
    });
  });
});

describe('transformCSSFileContent function', () => {
  ['1'].forEach((e) => {
    test(`test file ${e}`, () => {
      const sourceContent = fs.readFileSync(path.resolve(__dirname, `./${e}-source.scss`), 'utf8');
      const destinationContent = fs.readFileSync(path.resolve(__dirname, `./${e}-destination.scss`), 'utf8');
      expect(transformCSSFileContent(sourceContent)).toBe(destinationContent);
    });
  })
});
