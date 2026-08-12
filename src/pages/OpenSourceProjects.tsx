import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Github,
  Laptop,
  LockKeyhole,
  MonitorDot,
} from 'lucide-react'

import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface OpenSourceProject {
  name: string
  description: string
  repositoryUrl: string
  releasesUrl: string
  type: string
  platform: string
  dataPolicy: string
  technologies: string[]
  features: string[]
}

const projects: OpenSourceProject[] = [
  {
    name: 'SpendScope',
    description:
      '在 macOS 菜单栏查看 Codex Token 用量、额度状态和使用趋势，将本机分散的使用记录整理成清晰的摘要与详细看板。',
    repositoryUrl: 'https://github.com/ychp/SpendScope',
    releasesUrl: 'https://github.com/ychp/SpendScope/releases',
    type: 'macOS 菜单栏应用',
    platform: 'macOS 14+',
    dataPolicy: '仅在本机处理',
    technologies: ['Swift', 'SwiftUI', 'AppKit', 'Swift Charts', 'SQLite'],
    features: [
      '查看 5 小时与 7 天额度、Token 构成和重置时间',
      '通过趋势图和月度日历观察每日使用变化',
      '按 Skills、Tools、工作区和模型分析用量',
    ],
  },
]

export function OpenSourceProjects() {
  return (
    <div className="space-y-8">
      <ToolPageHeader
        icon={<Github className="h-6 w-6" />}
        title="自研开源项目"
        description="这里收录我开发并公开源代码的软件项目，包含项目简介、运行平台和核心技术信息。"
      />

      <div className="space-y-5">
        {projects.map((project) => (
          <Card
            key={project.name}
            className="overflow-hidden border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/70 dark:bg-slate-950/60"
          >
            <article className="grid md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/20">
                    <ChartNoAxesCombined className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                      {project.name}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                      {project.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 text-sm text-slate-700 dark:text-slate-300 lg:grid-cols-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 leading-5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2" aria-label="核心技术">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="border-t border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/60 md:border-l md:border-t-0 sm:p-6">
                <dl className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MonitorDot className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-slate-500 dark:text-slate-500">项目类型</dt>
                      <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{project.type}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-slate-500 dark:text-slate-500">运行平台</dt>
                      <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{project.platform}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-slate-500 dark:text-slate-500">数据处理</dt>
                      <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{project.dataPolicy}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 grid gap-2.5">
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants(), 'w-full')}
                  >
                    <Github aria-hidden="true" />
                    查看源代码
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a
                    href={project.releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                  >
                    查看 Releases
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </aside>
            </article>
          </Card>
        ))}
      </div>
    </div>
  )
}
