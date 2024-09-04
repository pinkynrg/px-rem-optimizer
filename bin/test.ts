import { transformBasicValue, transformComplexValue } from ".";
import basicConfig from "./config.json";

test('trasform basic values', () => {
  expect(transformBasicValue('0px', 'rem')).toBe('0rem');
  expect(transformBasicValue('0px', 'px')).toBe('0px');
  expect(transformBasicValue('16px', 'rem')).toBe('1rem');
  expect(transformBasicValue('-16px', 'rem')).toBe('-1rem');
  expect(transformBasicValue('-15px', 'rem')).toBe('-1rem');
  expect(transformBasicValue('1px', 'px')).toBe('1px');
  expect(transformBasicValue('0.125rem', 'px')).toBe('2px');
  expect(transformBasicValue('-0.125rem', 'px')).toBe('-2px');
  expect(transformBasicValue('.125rem', 'px')).toBe('2px');
  expect(transformBasicValue('1.6px', 'px')).toBe('2px');
  expect(transformBasicValue('1.5px', 'px')).toBe('2px');
  
  // custom rules
  const newConfigWithCustomRegex = {
    ...basicConfig, 
    lengthMatchingRules: {
      ...basicConfig.lengthMatchingRules,
      'px': "(\\-?\\d+(\\.\\d+)?|\\.\\d+)px|to-rem\\((\\-?\\d+(\\.\\d+)?|\\.\\d+)px\\)"
    }}
  
  expect(transformBasicValue('0px', 'rem')).toBe('0rem');
  expect(transformBasicValue('0px', 'px')).toBe('0px');
  expect(transformBasicValue('16px', 'rem')).toBe('1rem');
  expect(transformBasicValue('-16px', 'rem')).toBe('-1rem');
  expect(transformBasicValue('-15px', 'rem')).toBe('-1rem');
  expect(transformBasicValue('1px', 'px')).toBe('1px');
  expect(transformBasicValue('0.125rem', 'px')).toBe('2px');
  expect(transformBasicValue('-0.125rem', 'px')).toBe('-2px');
  expect(transformBasicValue('.125rem', 'px')).toBe('2px');
  expect(transformBasicValue('1.6px', 'px')).toBe('2px');
  expect(transformBasicValue('1.5px', 'px')).toBe('2px');
  expect(transformBasicValue('to-rem(16px)', 'px', newConfigWithCustomRegex)).toBe('16px');
  expect(transformBasicValue('to-rem(16px)', 'rem', newConfigWithCustomRegex)).toBe('1rem');
  expect(transformBasicValue('to-rem(-16px)', 'px', newConfigWithCustomRegex)).toBe('-16px');
  expect(transformBasicValue('to-rem(-16px)', 'rem', newConfigWithCustomRegex)).toBe('-1rem');

  const newConfigWithRoundingDisabled = {
    ...basicConfig, 
    round: {
      ...basicConfig.round,
      enabled: false,
    }
  }

  expect(transformBasicValue('1.6px', 'px', newConfigWithRoundingDisabled)).toBe('1.6px /* tofix: 2px */');
  expect(transformBasicValue('1.5px', 'px', newConfigWithRoundingDisabled)).toBe('1.5px /* tofix: 2px */');
  expect(transformBasicValue('1.4px', 'px', newConfigWithRoundingDisabled)).toBe('1.4px /* tofix: 1px */');
  expect(transformBasicValue('-1.6px', 'px', newConfigWithRoundingDisabled)).toBe('-1.6px /* tofix: -2px */');
  expect(transformBasicValue('-1.5px', 'px', newConfigWithRoundingDisabled)).toBe('-1.5px /* tofix: -1px */');
  expect(transformBasicValue('-1.4px', 'px', newConfigWithRoundingDisabled)).toBe('-1.4px /* tofix: -1px */');

});

test('trasform complex values', () => {
  expect(transformComplexValue('width', '16px;', basicConfig)).toBe('1rem;');
  expect(transformComplexValue('border', '0.0625rem 0.0625rem 0.0625rem 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(transformComplexValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(transformComplexValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');

  // custom rules
  const newConfig = {
    ...basicConfig, 
    lengthMatchingRules: {
      ...basicConfig.lengthMatchingRules,
      'px': "(\\-?\\d+(\\.\\d+)?|\\.\\d+)px|to-rem\\((\\-?\\d+(\\.\\d+)?|\\.\\d+)px\\)"
    }}

  expect(transformComplexValue('width', '16px;', basicConfig)).toBe('1rem;');
  expect(transformComplexValue('border', '0.0625rem 0.0625rem 0.0625rem 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(transformComplexValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(transformComplexValue('border', '1px 0.0625rem 1px 0.0625rem;', basicConfig)).toBe('1px 1px 1px 1px;');
  expect(transformComplexValue('width', 'to-rem(16px);', newConfig)).toBe('1rem;');
  expect(transformComplexValue('width', 'to-rem(-16px);', newConfig)).toBe('-1rem;');
  expect(transformComplexValue('padding', 'to-rem(4px) to-rem(8px) to-rem(16px) to-rem(32px);', newConfig)).toBe('4px 8px 16px 32px;')
  expect(transformComplexValue('padding', '1rem 2rem 3rem 4rem;', newConfig)).toBe('16px 32px 48px 64px;')
  expect(transformComplexValue('translate', 'to-rem(30px) to-rem(-22px);', newConfig)).toBe('1.75rem -1.25rem;')
  
})