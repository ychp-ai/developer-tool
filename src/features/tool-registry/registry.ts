import {
  Code2,
  Hash,
  Link2,
  ArrowRightLeft,
  Clock,
  KeySquare,
  FileSearch,
  FileDiff,
  Lock,
  FileCode,
  RefreshCw,
  Palette,
  QrCode,
  Calculator,
  ShieldCheck,
  WrapText,
  Image as ImageIcon,
  Globe,
  FileSpreadsheet,
  Phone,
  MapPin,
  PhoneCall,
  BrainCircuit,
  Sparkles,
  DollarSign,
  FileText,
  Layers,
  Building,
  Type,
  Github,
  WalletCards,
} from 'lucide-react'
import type { ToolGroup } from './types'

export const toolGroups: ToolGroup[] = [
  {
    name: '格式化',
    icon: FileCode,
    tools: [
      {
        path: '/json-formatter',
        gradient: 'from-sky-500 to-sky-600',
        load: () =>
          import('../../tools/formatting/JsonFormatter').then((m) => ({ default: m.JsonFormatter })),
        name: 'JSON 格式化',
        icon: Code2,
      },
      {
        path: '/xml-formatter',
        gradient: 'from-blue-500 to-blue-600',
        load: () => import('../../tools/formatting/XmlFormatter').then((m) => ({ default: m.XmlFormatter })),
        name: 'XML 格式化',
        icon: FileCode,
      },
      {
        path: '/code-formatter',
        gradient: 'from-indigo-500 to-purple-600',
        load: () =>
          import('../../tools/formatting/CodeFormatter').then((m) => ({ default: m.CodeFormatter })),
        name: '代码格式化',
        icon: Code2,
      },
    ],
  },
  {
    name: '编码转换',
    icon: Hash,
    tools: [
      {
        path: '/base64',
        gradient: 'from-cyan-500 to-cyan-600',
        load: () => import('../../tools/convertor/Base64').then((m) => ({ default: m.Base64 })),
        name: 'Base64 编解码',
        icon: Hash,
      },
      {
        path: '/url-encoder',
        gradient: 'from-sky-400 to-sky-500',
        load: () => import('../../tools/convertor/UrlEncoder').then((m) => ({ default: m.UrlEncoder })),
        name: 'URL 编解码',
        icon: Link2,
      },
      {
        path: '/json-yaml-converter',
        gradient: 'from-teal-500 to-cyan-600',
        load: () =>
          import('../../tools/convertor/JsonYamlConverter').then((m) => ({ default: m.JsonYamlConverter })),
        name: 'JSON/YAML 转换',
        icon: ArrowRightLeft,
      },
      {
        path: '/image-base64',
        gradient: 'from-violet-500 to-purple-600',
        load: () => import('../../tools/media/ImageBase64').then((m) => ({ default: m.ImageBase64 })),
        name: '图片 Base64',
        icon: ImageIcon,
      },
    ],
  },
  {
    name: '文本处理',
    icon: FileSearch,
    tools: [
      {
        path: '/regex-tester',
        gradient: 'from-blue-500 to-blue-600',
        load: () => import('../../tools/text/RegexTester').then((m) => ({ default: m.RegexTester })),
        name: '正则测试',
        icon: FileSearch,
      },
      {
        path: '/diff-checker',
        gradient: 'from-indigo-500 to-indigo-600',
        load: () => import('../../tools/text/DiffChecker').then((m) => ({ default: m.DiffChecker })),
        name: '文本对比',
        icon: FileDiff,
      },
      {
        path: '/string-join-split',
        gradient: 'from-sky-500 to-indigo-500',
        load: () =>
          import('../../tools/text/StringJoinAndSplit').then((m) => ({ default: m.StringJoinAndSplit })),
        name: '字符串合并拆分',
        icon: WrapText,
      },
      {
        path: '/text-extractor',
        gradient: 'from-cyan-500 to-blue-600',
        load: () => import('../../tools/text/TextExtractor').then((m) => ({ default: m.TextExtractor })),
        name: '文本提取器',
        icon: FileSearch,
      },
      {
        path: '/text-length-calculator',
        gradient: 'from-indigo-500 to-purple-600',
        load: () =>
          import('../../tools/text/TextLengthCalculator').then((m) => ({ default: m.TextLengthCalculator })),
        name: '文本长度计算器',
        icon: Type,
        description: '字符统计与数据库存储建议',
      },
    ],
  },
  {
    name: '转换工具',
    icon: Calculator,
    tools: [
      {
        path: '/timestamp',
        gradient: 'from-teal-500 to-teal-600',
        load: () => import('../../tools/convertor/Timestamp').then((m) => ({ default: m.Timestamp })),
        name: '时间戳转换',
        icon: Clock,
      },
      {
        path: '/color-converter',
        gradient: 'from-cyan-500 to-sky-500',
        load: () =>
          import('../../tools/convertor/ColorConverter').then((m) => ({ default: m.ColorConverter })),
        name: '颜色转换',
        icon: Palette,
      },
      {
        path: '/number-converter',
        gradient: 'from-blue-400 to-blue-500',
        load: () =>
          import('../../tools/convertor/NumberConverter').then((m) => ({ default: m.NumberConverter })),
        name: '进制转换',
        icon: Calculator,
      },
      {
        path: '/calculator',
        gradient: 'from-teal-500 to-cyan-600',
        load: () => import('../../tools/calculator/Calculator').then((m) => ({ default: m.Calculator })),
        name: '科学计算器',
        icon: Calculator,
        description: '支持基础运算和科学函数',
      },
    ],
  },
  {
    name: '生成器',
    icon: Sparkles,
    tools: [
      {
        path: '/uuid',
        gradient: 'from-emerald-500 to-emerald-600',
        load: () => import('../../tools/generator/UUID').then((m) => ({ default: m.UUID })),
        name: 'UUID 生成',
        icon: KeySquare,
      },
      {
        path: '/password-generator',
        gradient: 'from-teal-500 to-teal-600',
        load: () =>
          import('../../tools/generator/PasswordGenerator').then((m) => ({ default: m.PasswordGenerator })),
        name: '密码生成',
        icon: RefreshCw,
      },
      {
        path: '/qr-generator',
        gradient: 'from-cyan-400 to-cyan-500',
        load: () =>
          import('../../tools/generator/QrCodeGenerator').then((m) => ({ default: m.QrCodeGenerator })),
        name: '二维码生成',
        icon: QrCode,
      },
      {
        path: '/cron-generator',
        gradient: 'from-sky-500 to-blue-600',
        load: () => import('../../tools/generator/CronGenerator').then((m) => ({ default: m.CronGenerator })),
        name: 'Cron 生成',
        icon: Clock,
      },
    ],
  },
  {
    name: '媒体工具',
    icon: ImageIcon,
    tools: [
      {
        path: '/image-link-preview',
        gradient: 'from-sky-500 to-violet-500',
        load: () =>
          import('../../tools/media/ImageLinkPreview').then((m) => ({ default: m.ImageLinkPreview })),
        name: '图片链接预览',
        icon: ImageIcon,
      },
      {
        path: '/table-viewer',
        gradient: 'from-blue-500 to-blue-600',
        load: () => import('../../tools/utils/TableViewer').then((m) => ({ default: m.TableViewer })),
        name: '表格预览',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    name: '加密工具',
    icon: Lock,
    tools: [
      {
        path: '/hash-generator',
        gradient: 'from-indigo-500 to-blue-500',
        load: () => import('../../tools/security/HashGenerator').then((m) => ({ default: m.HashGenerator })),
        name: '哈希生成',
        icon: Lock,
      },
      {
        path: '/jwt-decoder',
        gradient: 'from-sky-500 to-blue-500',
        load: () => import('../../tools/security/JwtDecoder').then((m) => ({ default: m.JwtDecoder })),
        name: 'JWT 解码',
        icon: ShieldCheck,
      },
    ],
  },
  {
    name: '浏览器扩展',
    icon: Globe,
    tools: [
      {
        path: '/chrome-extensions',
        gradient: 'from-cyan-500 to-blue-600',
        load: () =>
          import('../../tools/browser/ChromeExtensions').then((m) => ({ default: m.ChromeExtensions })),
        name: 'Chrome 扩展',
        icon: Code2,
      },
    ],
  },
  {
    name: '生活查询',
    icon: Phone,
    tools: [
      {
        path: '/phone-number',
        gradient: 'from-emerald-500 to-emerald-600',
        load: () => import('../../tools/lifestyle/PhoneNumber').then((m) => ({ default: m.PhoneNumber })),
        name: '手机号归属',
        icon: Phone,
      },
      {
        path: '/postal-code',
        gradient: 'from-teal-500 to-teal-600',
        load: () => import('../../tools/lifestyle/PostalCode').then((m) => ({ default: m.PostalCode })),
        name: '邮编查询',
        icon: MapPin,
      },
      {
        path: '/area-code',
        gradient: 'from-cyan-500 to-cyan-600',
        load: () => import('../../tools/lifestyle/AreaCode').then((m) => ({ default: m.AreaCode })),
        name: '电话区号',
        icon: PhoneCall,
      },
      {
        path: '/mortgage-calculator',
        gradient: 'from-blue-500 to-indigo-600',
        load: () =>
          import('../../tools/lifestyle/MortgageCalculator').then((m) => ({ default: m.MortgageCalculator })),
        name: '房贷计算器',
        icon: Building,
      },
    ],
  },
  {
    name: 'AI 工具',
    icon: BrainCircuit,
    tools: [
      {
        path: '/token-calculator',
        gradient: 'from-violet-500 to-purple-600',
        load: () => import('../../tools/ai/TokenCalculator').then((m) => ({ default: m.TokenCalculator })),
        name: 'Token 计算器',
        icon: BrainCircuit,
      },
      {
        path: '/ai-price-calculator',
        gradient: 'from-emerald-500 to-teal-600',
        load: () =>
          import('../../tools/ai/AIPriceCalculator').then((m) => ({ default: m.AIPriceCalculator })),
        name: 'AI 价格计算器',
        icon: DollarSign,
      },
      {
        path: '/function-calling-generator',
        gradient: 'from-sky-500 to-blue-600',
        load: () =>
          import('../../tools/ai/FunctionCallingGenerator').then((m) => ({
            default: m.FunctionCallingGenerator,
          })),
        name: 'Function Calling 生成器',
        icon: Code2,
      },
      {
        path: '/json-to-prompt',
        gradient: 'from-cyan-500 to-sky-600',
        load: () => import('../../tools/ai/JsonToPrompt').then((m) => ({ default: m.JsonToPrompt })),
        name: 'JSON → Prompt',
        icon: ArrowRightLeft,
      },
      {
        path: '/image-prompt-generator',
        gradient: 'from-violet-500 to-pink-600',
        load: () =>
          import('../../tools/ai/ImagePromptGenerator').then((m) => ({ default: m.ImagePromptGenerator })),
        name: '图像 Prompt 生成器',
        icon: ImageIcon,
      },
      {
        path: '/system-prompt-generator',
        gradient: 'from-purple-500 to-indigo-600',
        load: () =>
          import('../../tools/ai/SystemPromptGenerator').then((m) => ({ default: m.SystemPromptGenerator })),
        name: 'System Prompt 生成器',
        icon: Sparkles,
      },
      {
        path: '/markdown-to-prompt',
        gradient: 'from-blue-500 to-violet-600',
        load: () => import('../../tools/ai/MarkdownToPrompt').then((m) => ({ default: m.MarkdownToPrompt })),
        name: 'Markdown → Prompt',
        icon: FileText,
      },
      {
        path: '/fewshot-formatter',
        gradient: 'from-teal-500 to-cyan-600',
        load: () => import('../../tools/ai/FewshotFormatter').then((m) => ({ default: m.FewshotFormatter })),
        name: 'Few-shot 格式化',
        icon: Layers,
      },
      {
        path: '/image-size-calculator',
        gradient: 'from-indigo-500 to-purple-600',
        load: () =>
          import('../../tools/ai/ImageSizeCalculator').then((m) => ({ default: m.ImageSizeCalculator })),
        name: '图像尺寸计算器',
        icon: Calculator,
      },
      {
        path: '/rag-text-chunker',
        name: 'RAG 文本分块器',
        icon: Layers,
        gradient: 'from-teal-500 to-cyan-600',
        load: () => import('../../tools/ai/RagTextChunker').then((m) => ({ default: m.RagTextChunker })),
      },
      {
        path: '/vector-similarity',
        name: '向量相似度计算',
        icon: BrainCircuit,
        gradient: 'from-indigo-500 to-purple-600',
        load: () => import('../../tools/ai/VectorSimilarity').then((m) => ({ default: m.VectorSimilarity })),
      },
    ],
  },
  {
    name: '自研开源',
    icon: Github,
    tools: [
      {
        path: '/open-source-projects',
        gradient: 'from-sky-500 to-blue-600',
        load: () => import('../../pages/OpenSourceProjects').then((m) => ({ default: m.OpenSourceProjects })),
        showOnHome: false,
        name: '开源项目',
        icon: WalletCards,
        description: '自研软件与开源代码',
      },
    ],
  },
]

export const tools = toolGroups.flatMap((group) =>
  group.tools.map((tool) => ({ ...tool, category: group.name })),
)
export const toolByPath = new Map<string, (typeof tools)[number]>(tools.map((tool) => [tool.path, tool]))
export const homeTools = tools.filter((tool) => tool.showOnHome !== false)
