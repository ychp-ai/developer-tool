import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Check,
  Copy,
  Download,
  FileDiff,
  FileUp,
  Trash2,
} from 'lucide-react'
import { createTwoFilesPatch, diffArrays, diffChars } from 'diff'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type DiffRowKind = 'unchanged' | 'modified' | 'removed' | 'added'
type MergeDirection = 'left-to-right' | 'right-to-left'
type EditorSide = 'left' | 'right'

interface DiffRow {
  id: string
  kind: DiffRowKind
  leftText: string | null
  rightText: string | null
  leftLineNumber: number | null
  rightLineNumber: number | null
  leftIndex: number | null
  rightIndex: number | null
  leftInsertIndex: number
  rightInsertIndex: number
}

interface DiffStats {
  added: number
  removed: number
  modified: number
  unchanged: number
}

interface EditorPanelProps {
  side: EditorSide
  title: string
  description: string
  value: string
  fileName: string
  onChange: (value: string) => void
  onFile: (file: File) => void
  onDownload: () => void
  onClear: () => void
}

interface DiffCellProps {
  side: EditorSide
  row: DiffRow
  shouldWrap: boolean
}

function splitLines(text: string): string[] {
  if (!text) return []
  return text.replace(/\r\n?/g, '\n').split('\n')
}

function buildDiffRows(leftText: string, rightText: string, ignoreWhitespace: boolean): DiffRow[] {
  const leftLines = splitLines(leftText)
  const rightLines = splitLines(rightText)
  const normalizeLine = (line: string) =>
    ignoreWhitespace ? line.replace(/\s+/g, '') : line
  const changes = diffArrays(leftLines, rightLines, {
    comparator: (left, right) => normalizeLine(left) === normalizeLine(right),
  })
  const rows: DiffRow[] = []
  let leftCursor = 0
  let rightCursor = 0
  let changeIndex = 0

  while (changeIndex < changes.length) {
    const change = changes[changeIndex]

    if (!change.added && !change.removed) {
      for (let index = 0; index < change.count; index += 1) {
        rows.push({
          id: `equal-${leftCursor}-${rightCursor}`,
          kind: 'unchanged',
          leftText: leftLines[leftCursor],
          rightText: rightLines[rightCursor],
          leftLineNumber: leftCursor + 1,
          rightLineNumber: rightCursor + 1,
          leftIndex: leftCursor,
          rightIndex: rightCursor,
          leftInsertIndex: leftCursor,
          rightInsertIndex: rightCursor,
        })
        leftCursor += 1
        rightCursor += 1
      }
      changeIndex += 1
      continue
    }

    const removedLines: string[] = []
    const addedLines: string[] = []

    while (
      changeIndex < changes.length &&
      (changes[changeIndex].added || changes[changeIndex].removed)
    ) {
      const changedBlock = changes[changeIndex]
      if (changedBlock.removed) removedLines.push(...changedBlock.value)
      if (changedBlock.added) addedLines.push(...changedBlock.value)
      changeIndex += 1
    }

    const blockLength = Math.max(removedLines.length, addedLines.length)
    for (let index = 0; index < blockLength; index += 1) {
      const leftLine = removedLines[index] ?? null
      const rightLine = addedLines[index] ?? null
      const leftIndex = leftLine === null ? null : leftCursor
      const rightIndex = rightLine === null ? null : rightCursor

      rows.push({
        id: `change-${leftCursor}-${rightCursor}-${index}`,
        kind:
          leftLine !== null && rightLine !== null
            ? 'modified'
            : leftLine !== null
              ? 'removed'
              : 'added',
        leftText: leftLine,
        rightText: rightLine,
        leftLineNumber: leftIndex === null ? null : leftIndex + 1,
        rightLineNumber: rightIndex === null ? null : rightIndex + 1,
        leftIndex,
        rightIndex,
        leftInsertIndex: leftCursor,
        rightInsertIndex: rightCursor,
      })

      if (leftLine !== null) leftCursor += 1
      if (rightLine !== null) rightCursor += 1
    }
  }

  return rows
}

function getStats(rows: DiffRow[]): DiffStats {
  return rows.reduce<DiffStats>(
    (stats, row) => {
      if (row.kind === 'added') stats.added += 1
      if (row.kind === 'removed') stats.removed += 1
      if (row.kind === 'modified') stats.modified += 1
      if (row.kind === 'unchanged') stats.unchanged += 1
      return stats
    },
    { added: 0, removed: 0, modified: 0, unchanged: 0 },
  )
}

function InlineDiff({ side, leftText, rightText }: {
  side: EditorSide
  leftText: string
  rightText: string
}) {
  const characterChanges = diffChars(leftText, rightText)

  return characterChanges.map((change, index) => {
    if (side === 'left' && change.added) return null
    if (side === 'right' && change.removed) return null

    const isChanged = side === 'left' ? change.removed : change.added
    return (
      <span
        key={`${index}-${change.value}`}
        className={cn(
          isChanged && side === 'left' &&
            'rounded-sm bg-red-300/70 text-red-950 dark:bg-red-500/45 dark:text-red-50',
          isChanged && side === 'right' &&
            'rounded-sm bg-emerald-300/70 text-emerald-950 dark:bg-emerald-500/45 dark:text-emerald-50',
        )}
      >
        {change.value}
      </span>
    )
  })
}

function DiffCell({ side, row, shouldWrap }: DiffCellProps) {
  const text = side === 'left' ? row.leftText : row.rightText
  const lineNumber = side === 'left' ? row.leftLineNumber : row.rightLineNumber
  const isEmptySide = text === null
  const isModified = row.kind === 'modified'

  return (
    <div
      className={cn(
        'grid min-h-9 grid-cols-[3rem_minmax(0,1fr)] border-b last:border-b-0',
        row.kind === 'removed' && side === 'left' && 'bg-red-500/10',
        row.kind === 'added' && side === 'right' && 'bg-emerald-500/10',
        row.kind === 'modified' && side === 'left' && 'bg-red-500/10',
        row.kind === 'modified' && side === 'right' && 'bg-emerald-500/10',
        isEmptySide && 'bg-muted/35',
      )}
    >
      <span
        className={cn(
          'select-none border-r px-2 py-2 text-right font-mono text-xs text-muted-foreground/70',
          isEmptySide && 'opacity-40',
        )}
        aria-hidden="true"
      >
        {lineNumber ?? '·'}
      </span>
      <code
        className={cn(
          'block min-w-0 px-3 py-2 font-mono text-[13px] leading-5',
          shouldWrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto whitespace-pre',
          isEmptySide && 'text-muted-foreground/40',
        )}
      >
        {isEmptySide ? ' ' : isModified && row.leftText !== null && row.rightText !== null ? (
          <InlineDiff
            side={side}
            leftText={row.leftText}
            rightText={row.rightText}
          />
        ) : (
          text || ' '
        )}
      </code>
    </div>
  )
}

function EditorPanel({
  side,
  title,
  description,
  value,
  fileName,
  onChange,
  onFile,
  onDownload,
  onClear,
}: EditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lineCount = splitLines(value).length

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onFile(file)
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <section className="min-w-0" aria-label={`${title}编辑器`}>
      <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                side === 'left' ? 'bg-red-400' : 'bg-emerald-400',
              )}
            />
            <h2 className="font-semibold">{title}</h2>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {fileName || description}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="导入文本文件"
            aria-label={`导入${title}文件`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="保存为文本文件"
            aria-label={`保存${title}`}
            disabled={!value}
            onClick={onDownload}
          >
            <Download />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="清空内容"
            aria-label={`清空${title}`}
            disabled={!value}
            onClick={onClear}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div
        className="p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className="min-h-[280px] resize-y rounded-lg border-0 bg-muted/35 p-4 font-mono text-[13px] leading-6 shadow-inner focus-visible:ring-2"
          placeholder={`在此粘贴${title}，或拖入文本文件…`}
          aria-label={title}
        />
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
        <span>{lineCount} 行</span>
        <span>{value.length.toLocaleString()} 字符</span>
      </div>
    </section>
  )
}

export function DiffChecker() {
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [leftFileName, setLeftFileName] = useState('')
  const [rightFileName, setRightFileName] = useState('')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [shouldWrap, setShouldWrap] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const deferredLeftText = useDeferredValue(leftText)
  const deferredRightText = useDeferredValue(rightText)
  const isUpdating = deferredLeftText !== leftText || deferredRightText !== rightText
  const rows = useMemo(
    () => buildDiffRows(deferredLeftText, deferredRightText, ignoreWhitespace),
    [deferredLeftText, deferredRightText, ignoreWhitespace],
  )
  const stats = useMemo(() => getStats(rows), [rows])
  const hasInput = Boolean(leftText || rightText)
  const hasDifference = stats.added + stats.removed + stats.modified > 0

  const handleSwap = () => {
    setLeftText(rightText)
    setRightText(leftText)
    setLeftFileName(rightFileName)
    setRightFileName(leftFileName)
  }

  const handleClearAll = () => {
    setLeftText('')
    setRightText('')
    setLeftFileName('')
    setRightFileName('')
    setError(null)
  }

  const handleReadFile = (file: File, side: EditorSide) => {
    const reader = new FileReader()
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : ''
      if (side === 'left') {
        setLeftText(content)
        setLeftFileName(file.name)
      } else {
        setRightText(content)
        setRightFileName(file.name)
      }
      setError(null)
    }
    reader.onerror = () => setError(`无法读取文件“${file.name}”，请确认它是文本文件。`)
    reader.readAsText(file)
  }

  const handleDownload = (text: string, side: EditorSide) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = side === 'left' ? 'original.txt' : 'modified.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyPatch = async () => {
    const patch = createTwoFilesPatch('原文', '新文', leftText, rightText, '', '', {
      context: 3,
    })
    await navigator.clipboard.writeText(patch)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleMergeRow = (row: DiffRow, direction: MergeDirection) => {
    const sourceIsLeft = direction === 'left-to-right'
    const sourceText = sourceIsLeft ? row.leftText : row.rightText
    const targetText = sourceIsLeft ? rightText : leftText
    const targetLines = splitLines(targetText)
    const targetIndex = sourceIsLeft ? row.rightIndex : row.leftIndex
    const targetInsertIndex = sourceIsLeft ? row.rightInsertIndex : row.leftInsertIndex

    if (sourceText === null && targetIndex !== null) {
      targetLines.splice(targetIndex, 1)
    } else if (sourceText !== null && targetIndex === null) {
      targetLines.splice(targetInsertIndex, 0, sourceText)
    } else if (sourceText !== null && targetIndex !== null) {
      targetLines[targetIndex] = sourceText
    }

    const mergedText = targetLines.join('\n')
    if (sourceIsLeft) {
      setRightText(mergedText)
      setRightFileName('')
    } else {
      setLeftText(mergedText)
      setLeftFileName('')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <FileDiff className="h-8 w-8" />
            文本对比
          </h1>
          <p className="text-muted-foreground">
            实时对齐两段文本，逐行定位并合并差异
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSwap}
            disabled={!hasInput}
          >
            <ArrowLeftRight />
            交换两侧
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClearAll}
            disabled={!hasInput}
          >
            <Trash2 />
            全部清空
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden shadow-sm">
        <div className="grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <EditorPanel
            side="left"
            title="原文 A"
            description="输入原始文本"
            value={leftText}
            fileName={leftFileName}
            onChange={(value) => {
              setLeftText(value)
              setLeftFileName('')
            }}
            onFile={(file) => handleReadFile(file, 'left')}
            onDownload={() => handleDownload(leftText, 'left')}
            onClear={() => {
              setLeftText('')
              setLeftFileName('')
            }}
          />
          <EditorPanel
            side="right"
            title="新文 B"
            description="输入修改后的文本"
            value={rightText}
            fileName={rightFileName}
            onChange={(value) => {
              setRightText(value)
              setRightFileName('')
            }}
            onFile={(file) => handleReadFile(file, 'right')}
            onDownload={() => handleDownload(rightText, 'right')}
            onClear={() => {
              setRightText('')
              setRightFileName('')
            }}
          />
        </div>
      </Card>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <Card className="overflow-hidden shadow-sm">
        <div className="flex flex-col gap-4 border-b px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-semibold">对比结果</span>
            <span className="text-emerald-700 dark:text-emerald-300">
              +{stats.added} 新增
            </span>
            <span className="text-red-700 dark:text-red-300">-{stats.removed} 删除</span>
            <span className="text-amber-700 dark:text-amber-300">
              ~{stats.modified} 修改
            </span>
            <span className="text-muted-foreground">{stats.unchanged} 未变</span>
            {isUpdating && <span className="text-xs text-primary">正在更新…</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={ignoreWhitespace}
                onCheckedChange={setIgnoreWhitespace}
                aria-label="忽略空白字符"
              />
              忽略空白
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={shouldWrap}
                onCheckedChange={setShouldWrap}
                aria-label="自动换行"
              />
              自动换行
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasDifference}
              onClick={handleCopyPatch}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? '已复制' : '复制补丁'}
            </Button>
          </div>
        </div>

        {!hasInput ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="rounded-full bg-muted p-3 text-muted-foreground">
              <FileDiff className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">在上方输入或拖入两份文本</p>
              <p className="mt-1 text-sm text-muted-foreground">
                差异会自动按行对齐，无需手动点击比较
              </p>
            </div>
          </div>
        ) : !hasDifference ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
            <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-medium">两侧文本一致</p>
            {ignoreWhitespace && (
              <p className="text-sm text-muted-foreground">已忽略空格、缩进和换行内的空白差异</p>
            )}
          </div>
        ) : (
          <div className="max-h-[620px] overflow-auto">
            <div className={cn('min-w-[760px]', !shouldWrap && 'min-w-[1000px]')}>
              <div className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] border-b bg-card/95 text-xs font-medium text-muted-foreground backdrop-blur">
                <div className="px-4 py-2">原文 A</div>
                <div className="border-x px-1 py-2 text-center">合并</div>
                <div className="px-4 py-2">新文 B</div>
              </div>
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]"
                >
                  <DiffCell side="left" row={row} shouldWrap={shouldWrap} />
                  <div className="flex min-h-9 flex-col items-center justify-center gap-0.5 border-x border-b bg-muted/20 py-1">
                    {row.kind !== 'unchanged' && (
                      <>
                        <button
                          type="button"
                          className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          title="采用原文此行"
                          aria-label={`将原文第${row.leftLineNumber ?? '空'}行合并到新文`}
                          onClick={() => handleMergeRow(row, 'left-to-right')}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          title="采用新文此行"
                          aria-label={`将新文第${row.rightLineNumber ?? '空'}行合并到原文`}
                          onClick={() => handleMergeRow(row, 'right-to-left')}
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  <DiffCell side="right" row={row} shouldWrap={shouldWrap} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        所有比较均在浏览器本地完成，文本和文件不会上传到服务器
      </p>
    </div>
  )
}
