import { getEncoding } from 'js-tiktoken'

type ChunkStrategy = 'tokens' | 'chars' | 'paragraphs' | 'sentences'

export interface Chunk {
  id: string
  index: number
  content: string
  tokenCount: number
  charCount: number
}

export interface ChunkConfig {
  strategy: ChunkStrategy
  maxTokens: number
  maxChars: number
  overlapTokens: number
  overlapChars: number
  separator: string
  preserveFormatting: boolean
}

let cachedEncoding: ReturnType<typeof getEncoding> | undefined
const getTokenizer = () => (cachedEncoding ??= getEncoding('cl100k_base'))

export const countTokens = (text: string): number => {
  return getTokenizer().encode(text).length
}

const splitBySentences = (text: string): string[] => {
  const sentenceRegex = /([。！？.!?]+)\s*/g
  const sentences: string[] = []
  let lastIndex = 0
  let match

  while ((match = sentenceRegex.exec(text)) !== null) {
    const sentence = text.slice(lastIndex, match.index + match[1].length).trim()
    if (sentence) {
      sentences.push(sentence)
    }
    lastIndex = match.index + match[1].length
  }

  const remaining = text.slice(lastIndex).trim()
  if (remaining) {
    sentences.push(remaining)
  }

  return sentences.filter((s) => s.length > 0)
}

const splitByParagraphs = (text: string, separator: string): string[] => {
  return text
    .split(separator)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

const createChunksWithOverlap = (
  items: string[],
  maxSize: number,
  overlapSize: number,
  countFn: (item: string) => number,
  config: ChunkConfig,
): string[] => {
  const chunks: string[] = []
  let currentChunk = ''
  let currentSize = 0
  let startIndex = 0

  for (let i = startIndex; i < items.length; i++) {
    const itemSize = countFn(items[i])

    if (currentSize + itemSize > maxSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())

      const overlapItems: string[] = []
      let currentOverlapSize = 0
      for (let j = i - 1; j >= startIndex && currentOverlapSize < overlapSize; j--) {
        overlapItems.unshift(items[j])
        currentOverlapSize += countFn(items[j])
      }

      currentChunk = overlapItems.join(config.strategy === 'paragraphs' ? config.separator : ' ')
      currentSize = overlapItems.reduce((sum, item) => sum + countFn(item), 0)
      startIndex = i - overlapItems.length
    }

    if (currentChunk.length > 0) {
      currentChunk += config.strategy === 'paragraphs' ? config.separator : ' '
    }
    currentChunk += items[i]
    currentSize += itemSize
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

const createChunksByChars = (text: string, maxChars: number, overlapChars: number): string[] => {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + Math.max(1, maxChars), text.length)
    const chunk = text.slice(start, end)
    chunks.push(chunk)

    if (end >= text.length) break

    start = Math.max(start + 1, end - Math.max(0, overlapChars))
  }

  return chunks
}

export function chunkText(inputText: string, config: ChunkConfig): Chunk[] {
  if (!inputText.trim()) return []

  const encoding = getTokenizer()
  let rawChunks: string[] = []

  switch (config.strategy) {
    case 'tokens': {
      const tokens = encoding.encode(inputText)
      const chunkSize = Math.max(1, config.maxTokens)
      const overlap = config.overlapTokens

      const tokenChunks: number[][] = []
      let start = 0

      while (start < tokens.length) {
        const end = Math.min(start + chunkSize, tokens.length)
        tokenChunks.push(tokens.slice(start, end))

        if (end >= tokens.length) break
        start = Math.max(start + 1, end - Math.max(0, overlap))
      }

      rawChunks = tokenChunks.map((chunk) => encoding.decode(chunk))
      break
    }

    case 'chars': {
      rawChunks = createChunksByChars(inputText, config.maxChars, config.overlapChars)
      break
    }

    case 'sentences': {
      const sentences = splitBySentences(inputText)
      rawChunks = createChunksWithOverlap(
        sentences,
        config.maxTokens,
        config.overlapTokens,
        countTokens,
        config,
      )
      break
    }

    case 'paragraphs': {
      const paragraphs = splitByParagraphs(inputText, config.separator)
      rawChunks = createChunksWithOverlap(
        paragraphs,
        config.maxTokens,
        config.overlapTokens,
        countTokens,
        config,
      )
      break
    }
  }

  return rawChunks.map((content, index) => ({
    id: String(index),
    index: index + 1,
    content,
    tokenCount: countTokens(content),
    charCount: content.length,
  }))
}
