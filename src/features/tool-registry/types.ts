import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ToolDefinition {
  path: `/${string}`
  name: string
  icon: LucideIcon
  description?: string
  gradient: string
  showOnHome?: boolean
  isExternal?: boolean
  load: () => Promise<{ default: ComponentType }>
}

export interface ToolGroup {
  name: string
  icon: LucideIcon
  tools: ToolDefinition[]
}
