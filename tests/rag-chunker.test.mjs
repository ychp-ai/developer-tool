import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chunkText, countTokens } from '../src/tools/ai/lib/rag-chunker.ts'

const config = {
  strategy: 'chars',
  maxChars: 4,
  overlapChars: 1,
  maxTokens: 4,
  overlapTokens: 1,
  separator: '\n\n',
  preserveFormatting: true,
}

test('character chunks retain ordering and the requested overlap', () => {
  const chunks = chunkText('abcdefghij', config)
  assert.deepEqual(
    chunks.map((chunk) => chunk.content),
    ['abcd', 'defg', 'ghij'],
  )
  assert.deepEqual(
    chunks.map((chunk) => chunk.index),
    [1, 2, 3],
  )
})

test('zero sizes and oversized overlap still terminate', () => {
  for (const strategy of ['chars', 'tokens']) {
    const chunks = chunkText('abcdefghi', {
      ...config,
      strategy,
      maxChars: 0,
      maxTokens: 0,
      overlapChars: 100,
      overlapTokens: 100,
    })
    assert(chunks.length > 0 && chunks.length <= 9)
    assert(chunks.every((chunk) => chunk.content.length > 0))
  }
})

test('all strategies handle empty input and count resulting tokens', () => {
  for (const strategy of ['chars', 'tokens', 'sentences', 'paragraphs']) {
    assert.deepEqual(chunkText('  ', { ...config, strategy }), [])
    const chunks = chunkText('First sentence. Second sentence.\n\nThird paragraph.', { ...config, strategy })
    assert(chunks.length > 0)
    for (const chunk of chunks) assert.equal(chunk.tokenCount, countTokens(chunk.content))
  }
})
