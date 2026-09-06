type OutputFormat = 'plain' | 'structured' | 'clean' | 'code-block'

export interface ConversionOptions {
  preserveHeadings: boolean
  preserveLists: boolean
  preserveCodeBlocks: boolean
  preserveLinks: boolean
  removeEmptyLines: boolean
  outputFormat: OutputFormat
}

export const convertMarkdown = (markdown: string, opts: ConversionOptions): string => {
  let result = markdown

  if (opts.outputFormat === 'plain') {
    result = result
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(.+?)\*\*|__(.+?)__/g, (_match, stars, underscores) => stars ?? underscores)
      .replace(
        /\*([^*\n]+)\*|(?<!\w)_([^_\n]+)_(?!\w)/g,
        (_match, stars, underscores) => stars ?? underscores,
      )
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
  } else if (opts.outputFormat === 'structured') {
    result = result
      .replace(/^#{6}\s+(.+)$/gm, '###### $1')
      .replace(/^#{5}\s+(.+)$/gm, '##### $1')
      .replace(/^#{4}\s+(.+)$/gm, '#### $1')
      .replace(/^#{3}\s+(.+)$/gm, '### $1')
      .replace(/^#{2}\s+(.+)$/gm, '## $1')
      .replace(/^#{1}\s+(.+)$/gm, '# $1')
      .replace(/`{3}(\w+)?\n([\s\S]+?)\n`{3}/g, (_match, _lang, code) => {
        if (!opts.preserveCodeBlocks) return code.trim()
        return `【代码块】\n${code.trim()}\n【代码块结束】`
      })
      .replace(/`([^`]+)`/g, '「$1」')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$&' : '$1')
  } else if (opts.outputFormat === 'clean') {
    result = result
      .replace(/^#{1,6}\s+(.+)$/gm, (_match, title) => {
        return opts.preserveHeadings ? `▸ ${title}\n` : `${title}\n`
      })
      .replace(/^\s*[-*+]\s+/gm, opts.preserveLists ? '○ ' : '')
      .replace(/^\s*\d+\.\s+/gm, opts.preserveLists ? '' : '')
      .replace(/`{3}(\w+)?\n([\s\S]+?)\n`{3}/g, (_match, _lang, code) => {
        if (!opts.preserveCodeBlocks) return code.trim()
        return `「代码：${code.trim()}」`
      })
      .replace(/`([^`]+)`/g, '「$1」')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$&' : '$1')
      .replace(/\n{3,}/g, '\n\n')
  } else if (opts.outputFormat === 'code-block') {
    let content = result
    content = content
      .replace(/^#{1,6}\s+/gm, opts.preserveHeadings ? '# ' : '')
      .replace(/`{3}(\w+)?/g, opts.preserveCodeBlocks ? '```' : '')
      .replace(/`([^`]+)`/g, opts.preserveCodeBlocks ? '`$1`' : '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$&' : '$1')
      .replace(/^\s*[-*+]\s+/gm, opts.preserveLists ? '- ' : '')
    result = '```\n' + content + '\n```'
  }

  if (opts.removeEmptyLines) {
    result = result.replace(/\n{3,}/g, '\n\n')
  }

  return result.trim()
}
