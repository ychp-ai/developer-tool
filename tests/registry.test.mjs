import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tools, homeTools, toolGroups, toolByPath } from '../src/features/tool-registry/registry.ts'

test('every tool has a unique navigable path, display metadata and lazy loader', () => {
  assert.equal(tools.length, 41)
  assert.equal(homeTools.length, 40)
  assert.equal(new Set(tools.map((tool) => tool.path)).size, tools.length)
  for (const tool of tools) {
    assert.match(tool.path, /^\/[a-z0-9-]+$/)
    assert(tool.name && tool.icon && tool.gradient)
    assert.equal(typeof tool.load, 'function')
    assert.equal(toolByPath.get(tool.path), tool)
  }
})

test('navigation and home include both previously disconnected AI tools', () => {
  for (const path of ['/rag-text-chunker', '/vector-similarity']) {
    assert(homeTools.some((tool) => tool.path === path))
    assert(toolGroups.find((group) => group.name === 'AI 工具').tools.some((tool) => tool.path === path))
  }
})
