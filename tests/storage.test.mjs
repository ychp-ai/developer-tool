import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readStorage, readStringList, writeStorage } from '../src/lib/storage.ts'

test('storage validates saved lists, preserves order and removes duplicates', () => {
  const values = new Map([['history', '["/base64",42,"/base64","/uuid",null]']])
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  })
  assert.deepEqual(readStringList('history'), ['/base64', '/uuid'])
  writeStorage('history', '{"bad":"shape"}')
  assert.deepEqual(readStringList('history'), [])
  writeStorage('history', '{invalid')
  assert.deepEqual(readStringList('history'), [])
  assert.deepEqual(readStringList('missing'), [])
})

test('blocked browser storage does not prevent using the current session', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('denied')
    },
  })
  assert.equal(readStorage('theme'), null)
  assert.deepEqual(readStringList('favorites'), [])
  assert.doesNotThrow(() => writeStorage('theme', 'dark'))
})
