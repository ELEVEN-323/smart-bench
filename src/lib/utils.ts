import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并 className，处理 Tailwind 冲突（照抄组件库必备工具） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
