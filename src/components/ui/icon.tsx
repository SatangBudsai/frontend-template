'use client'

import { Icon as IconifyIcon, type IconProps } from '@iconify/react'

import { offlineIcons } from '@/config/icon-data'

function Icon(props: IconProps) {
  const bundledIcon = typeof props.icon === 'string' ? offlineIcons[props.icon as keyof typeof offlineIcons] : undefined

  return <IconifyIcon {...props} icon={bundledIcon ?? props.icon} />
}

export { Icon }
export type { IconProps }
