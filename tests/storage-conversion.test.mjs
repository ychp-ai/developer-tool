import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertStorage } from '../src/tools/convertor/storageConversion.ts';

const result = (input, unit, base, target) =>
  convertStorage(input, unit, base).find((row) => row.unit === target).value;

test('storage conversion handles binary, decimal, fractional and zero capacities', () => {
  assert.equal(result('1', 'GB', 1024, 'B'), '1073741824');
  assert.equal(result('1', 'GB', 1000, 'B'), '1000000000');
  assert.equal(result('1.5', 'TB', 1024, 'GB'), '1536');
  assert.equal(result('1048576', 'B', 1024, 'MB'), '1');
  assert.equal(result('1e6', 'B', 1000, 'MB'), '1');
  assert.equal(result('1', 'PB', 1024, 'B'), '1125899906842624');
  assert(convertStorage('0', 'GB', 1024).every((row) => row.value === '0'));
  assert(Number(result('1', 'B', 1024, 'PB')) > 0);
});

test('storage conversion rejects invalid inputs and numeric overflow or underflow', () => {
  for (const input of [
    '',
    ' ',
    '-1',
    'NaN',
    'Infinity',
    '0x10',
    '1MB',
    '1.2.3',
    '1e309',
    '1e-400',
  ]) {
    assert.throws(() => convertStorage(input, 'B', 1024));
  }
  assert.throws(() => convertStorage('1e308', 'PB', 1024));
  assert.throws(() => convertStorage('5e-324', 'B', 1024));
});
