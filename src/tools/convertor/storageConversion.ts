export const STORAGE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export type StorageUnit = (typeof STORAGE_UNITS)[number];
export type StorageBase = 1000 | 1024;

export interface StorageResult {
  unit: StorageUnit;
  value: string;
}

export function convertStorage(
  input: string,
  unit: StorageUnit,
  base: StorageBase,
): StorageResult[] {
  const trimmed = input.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    throw new Error('请输入有效的非负数值');
  }
  const value = Number(trimmed);
  if (
    !Number.isFinite(value) ||
    (value === 0 && /[1-9]/.test(trimmed.split(/e/i)[0]))
  ) {
    throw new Error('数值超出可转换范围，请调整输入');
  }
  const sourceIndex = STORAGE_UNITS.indexOf(unit);
  return STORAGE_UNITS.map((targetUnit, targetIndex) => {
    const converted = value * base ** (sourceIndex - targetIndex);
    if (!Number.isFinite(converted) || (value > 0 && converted === 0)) {
      throw new Error('数值超出可转换范围，请调整输入');
    }
    return {
      unit: targetUnit,
      value: Number.isSafeInteger(converted)
        ? String(converted)
        : Number(converted.toPrecision(15)).toString(),
    };
  });
}
