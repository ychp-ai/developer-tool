import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Calendar, Sparkles } from 'lucide-react'
import { homeTools as tools, toolGroups } from '@/features/tool-registry/registry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarCard } from '@/components/shared/CalendarCard'

const categories = toolGroups.filter(group => group.tools.some(tool => tool.showOnHome !== false)).map(group => group.name)
const categoryIcons = Object.fromEntries(toolGroups.map(group => [group.name, group.icon]))

const categoryColors: Record<string, string> = {
  '格式化': 'bg-gradient-to-br from-sky-500 to-blue-600',
  '编码转换': 'bg-gradient-to-br from-cyan-500 to-sky-600',
  '文本处理': 'bg-gradient-to-br from-blue-500 to-indigo-600',
  '转换工具': 'bg-gradient-to-br from-teal-500 to-cyan-600',
  '生成器': 'bg-gradient-to-br from-emerald-500 to-teal-600',
  '媒体工具': 'bg-gradient-to-br from-blue-500 to-violet-600',
  '加密工具': 'bg-gradient-to-br from-indigo-500 to-blue-600',
  '浏览器扩展': 'bg-gradient-to-br from-cyan-500 to-blue-600',
  '生活查询': 'bg-gradient-to-br from-emerald-500 to-cyan-600',
  'AI 工具': 'bg-gradient-to-br from-violet-500 to-purple-600',
}

const categoryBgColors: Record<string, string> = {
  '格式化': 'from-sky-50 to-blue-50',
  '编码转换': 'from-cyan-50 to-sky-50',
  '文本处理': 'from-blue-50 to-indigo-50',
  '转换工具': 'from-teal-50 to-cyan-50',
  '生成器': 'from-emerald-50 to-teal-50',
  '媒体工具': 'from-blue-50 to-violet-50',
  '加密工具': 'from-indigo-50 to-blue-50',
  '浏览器扩展': 'from-cyan-50 to-blue-50',
  '生活查询': 'from-emerald-50 to-cyan-50',
  'AI 工具': 'from-violet-50 to-purple-50',
}

export function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-[1920px] mx-auto relative">
     
      {/* 移动端/平板日历 - 显示在顶部 */}
      <div className="mb-4 sm:mb-6 xl:hidden">
        <Card className="shadow-lg border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
          <CardHeader className="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-sky-700 dark:text-slate-200">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              日历
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <CalendarCard />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 sm:gap-4 xl:gap-6 items-start flex-col xl:flex-row relative">
        {/* 桌面端日历侧边栏 - 只在大屏幕显示 */}
        <div className={`
          fixed xl:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          hidden xl:block xl:w-[360px] 2xl:w-[400px] xl:flex-shrink-0
          ${isSidebarOpen ? 'block' : ''}
        `}>
          <div className="h-full overflow-y-auto bg-white dark:bg-slate-950 xl:bg-transparent">
            <Card className="shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 xl:sticky top-4 sm:top-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
              <CardHeader className="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-sky-700 dark:text-slate-200">
                  <Calendar className="h-5 w-5" />
                  日历
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <CalendarCard />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 遮罩层 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 工具分类网格 */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-3 sm:gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            {categories.map((category) => {
              const CategoryIcon = categoryIcons[category] || Sparkles
              return (
                <Card
                  key={category}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/60 overflow-hidden bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none"
                >
                  <CardHeader className={`bg-gradient-to-br ${categoryBgColors[category]} dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50`}>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <div className={`p-2 rounded-lg ${categoryColors[category]} text-white shadow-sm`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {tools
                      .filter((tool) => tool.category === category)
                      .map((tool) => {
                        const Icon = tool.icon
                        return (
                          <Link key={tool.path} to={tool.path}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-11 px-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] transition-all duration-200 group/btn"
                            >
                              <div 
                                className={`p-1.5 rounded mr-3 text-white group-hover/btn:scale-110 transition-transform shadow-sm bg-gradient-to-br ${tool.gradient}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-medium text-slate-700 dark:text-slate-200">{tool.name}</span>
                            </Button>
                          </Link>
                        )
                      })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
