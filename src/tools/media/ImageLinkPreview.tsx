import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'

interface ImageLink {
  url: string
}

export function ImageLinkPreview() {
  const [inputText, setInputText] = useState('')
  const [imageLinks, setImageLinks] = useState<ImageLink[]>([])
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [brokenImageUrls, setBrokenImageUrls] = useState<Record<string, boolean>>({})
  const [isPreviewLoadError, setIsPreviewLoadError] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImageUrl(null)
        setIsPreviewLoadError(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const parseLinks = () => {
    const lines = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
    setImageLinks(lines.map((url) => ({ url })))
    setBrokenImageUrls({})
    setSelectedImageUrl(null)
    setIsPreviewLoadError(false)
  }

  const loadDemo = () => {
    const demoImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop'
    ]
    setInputText(demoImages.join('\n'))
    setImageLinks(demoImages.map((url) => ({ url })))
    setBrokenImageUrls({})
    setSelectedImageUrl(null)
    setIsPreviewLoadError(false)
  }

  const openImagePreview = (url: string) => {
    setSelectedImageUrl(url)
    setIsPreviewLoadError(false)
  }

  const closeImagePreview = () => {
    setSelectedImageUrl(null)
    setIsPreviewLoadError(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          图片链接预览
        </h1>
        <p className="text-sm text-muted-foreground">
          批量预览图片链接，支持多行输入
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">输入图片链接</CardTitle>
          <CardDescription className="text-xs">每行一个图片链接</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入图片链接，换行分割&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={parseLinks} className="flex-1">
              生成预览
            </Button>
            <Button onClick={loadDemo} variant="outline">
              示例演示
            </Button>
          </div>
        </CardContent>
      </Card>

      {imageLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">预览结果</CardTitle>
            <CardDescription className="text-xs">
              共 {imageLinks.length} 张图片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">图片预览</TableHead>
                  <TableHead>图片链接</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imageLinks.map((link, index) => (
                  <TableRow key={`${link.url}-${index}`}>
                    <TableCell>
                      {brokenImageUrls[link.url] ? (
                        <div className="flex h-24 w-40 items-center justify-center rounded-md border border-dashed bg-muted px-2 text-center text-xs text-muted-foreground">
                          图片加载失败
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onClick={() => openImagePreview(link.url)}
                          aria-label={`查看第 ${index + 1} 张图片大图`}
                          title="点击查看大图"
                        >
                          <img
                            src={link.url}
                            alt={`图片预览 ${index + 1}`}
                            className="max-w-[160px] max-h-[160px] object-contain rounded-md border bg-background cursor-zoom-in"
                            onError={() => {
                              setBrokenImageUrls((prev) => ({ ...prev, [link.url]: true }))
                            }}
                          />
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 break-all"
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="图片放大预览"
          onClick={closeImagePreview}
        >
          <div
            className="relative h-4/5 w-4/5 max-h-none max-w-none rounded-lg border bg-background p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 rounded-md bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/75"
              onClick={closeImagePreview}
            >
              关闭
            </button>
            {isPreviewLoadError ? (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed bg-muted px-4 text-center text-sm text-muted-foreground">
                大图加载失败，请使用右侧链接在新窗口打开查看。
              </div>
            ) : (
              <img
                src={selectedImageUrl}
                alt="放大预览"
                className="mx-auto h-full w-full rounded-md object-contain"
                onError={() => setIsPreviewLoadError(true)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
