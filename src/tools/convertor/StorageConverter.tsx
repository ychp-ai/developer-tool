import { useState } from 'react';
import { HardDrive } from 'lucide-react';

import { CopyButton } from '@/components/tool/CopyButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { convertStorage, STORAGE_UNITS } from './storageConversion';
import type {
  StorageBase,
  StorageResult,
  StorageUnit,
} from './storageConversion';

export function StorageConverter() {
  const [input, setInput] = useState('1');
  const [unit, setUnit] = useState<StorageUnit>('GB');
  const [base, setBase] = useState<StorageBase>(1024);
  let results: StorageResult[] = [];
  let error = '';
  if (input.trim()) {
    try {
      results = convertStorage(input, unit, base);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : '转换失败';
    }
  }

  const handleUnitChange = (value: string) => setUnit(value as StorageUnit);
  const handleBaseChange = (value: string) =>
    setBase(value === '1000' ? 1000 : 1024);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <HardDrive className="h-8 w-8" aria-hidden="true" />
          存储单位转换器
        </h1>
        <p className="text-muted-foreground">
          字节、KB、MB、GB、TB、PB 实时互转
        </p>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>输入存储容量</CardTitle>
            <CardDescription>
              支持小数和科学计数法，例如 1.5 或 1e6
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="storage-value" className="text-sm font-medium">
                数值
              </label>
              <Input
                id="storage-value"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="请输入存储容量"
                className="font-mono"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'storage-error' : undefined}
              />
              {error && (
                <p
                  id="storage-error"
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="storage-unit" className="text-sm font-medium">
                输入单位
              </label>
              <Select value={unit} onValueChange={handleUnitChange}>
                <SelectTrigger id="storage-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_UNITS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === 'B' ? 'B（字节）' : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="storage-base" className="text-sm font-medium">
                换算方式
              </label>
              <Select value={String(base)} onValueChange={handleBaseChange}>
                <SelectTrigger id="storage-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1024 进制（二进制）</SelectItem>
                  <SelectItem value="1000">1000 进制（十进制）</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {base === 1024
                  ? '每级相差 1024 倍。此模式沿用 KB、MB 等常见写法，标准二进制单位为 KiB、MiB、GiB、TiB、PiB。'
                  : '每级相差 1000 倍。例如 1 GB = 1000 MB，常用于硬盘厂商标注容量。'}
              </p>
            </div>
            <Button variant="outline" onClick={() => setInput('')}>
              清空
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>换算结果</CardTitle>
            <CardDescription>
              小数及超出安全整数范围的结果保留最多 15
              位有效数字，极大或极小数值使用科学计数法
            </CardDescription>
          </CardHeader>
          <CardContent aria-live="polite" aria-atomic="true">
            {results.length > 0 ? (
              <dl className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.unit}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <dt className="text-sm text-muted-foreground">
                        {result.unit === 'B' ? 'B（字节）' : result.unit}
                      </dt>
                      <dd className="break-all font-mono text-lg">
                        {result.value}
                      </dd>
                    </div>
                    <CopyButton
                      text={result.value}
                      variant="outline"
                      size="sm"
                      aria-label={`复制 ${result.unit} 换算结果`}
                    />
                  </div>
                ))}
              </dl>
            ) : (
              <p className="py-10 text-center text-muted-foreground">
                {error ? '请修正输入后查看结果' : '输入数值后查看换算结果'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
