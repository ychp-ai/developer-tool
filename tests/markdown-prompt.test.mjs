import { test } from 'node:test'
import assert from 'node:assert/strict'
import { convertMarkdown } from '../src/tools/ai/lib/markdown-prompt.ts'

const options = {
  preserveHeadings: false,
  preserveLists: false,
  preserveCodeBlocks: false,
  preserveLinks: false,
  removeEmptyLines: true,
  outputFormat: 'plain',
}

test('plain Markdown removes emphasis and links while retaining code content', () => {
  assert.equal(
    convertMarkdown(
      '# Title\n\n**bold** _italic_ ~~old~~ [link](https://example.com)\n`value`\n```js\nconst a = 1\n```',
      options,
    ),
    'Title\n\nbold italic old link\nvalue\nconst a = 1',
  )
})

test('preserve-links keeps actual URLs in all rich output modes', () => {
  for (const outputFormat of ['structured', 'clean', 'code-block']) {
    const input = '[docs](https://example.com/docs)'
    assert(
      convertMarkdown(input, { ...options, outputFormat, preserveLinks: true }).includes(
        'https://example.com/docs',
      ),
    )
    assert(
      !convertMarkdown(input, { ...options, outputFormat, preserveLinks: false }).includes(
        'https://example.com/docs',
      ),
    )
  }
})
