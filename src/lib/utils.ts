import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr = 'dd/MM/yyyy'): string {
  const { format } = require('date-fns')
  const { es } = require('date-fns/locale')
  return format(new Date(date), formatStr, { locale: es })
}

export function formatDateRelative(date: Date | string): string {
  const { formatDistanceToNow } = require('date-fns')
  const { es } = require('date-fns/locale')
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
