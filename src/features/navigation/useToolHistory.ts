import { useEffect, useState } from 'react'
import { readStringList, writeStorage } from '@/lib/storage'
import { toolByPath } from '../tool-registry/registry'

const isKnownPath = (path: string) => toolByPath.has(path)

export function useToolHistory(pathname: string) {
  const [favorites, setFavorites] = useState(
    () => new Set(readStringList('favoriteTools').filter(isKnownPath)),
  )
  const [recentTools, setRecentTools] = useState(() =>
    readStringList('recentTools').filter(isKnownPath).slice(0, 10),
  )

  useEffect(() => {
    writeStorage('favoriteTools', JSON.stringify([...favorites]))
  }, [favorites])

  useEffect(() => {
    writeStorage('recentTools', JSON.stringify(recentTools))
  }, [recentTools])

  const [previousPath, setPreviousPath] = useState('')
  if (pathname !== previousPath) {
    setPreviousPath(pathname)
    if (isKnownPath(pathname)) {
      setRecentTools((previous) =>
        previous[0] === pathname
          ? previous
          : [pathname, ...previous.filter((path) => path !== pathname)].slice(0, 10),
      )
    }
  }

  return { favorites, setFavorites, recentTools, setRecentTools }
}
