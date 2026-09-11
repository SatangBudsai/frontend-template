'use client'

import { Icon as IconifyIcon, type IconProps } from '@iconify/react'

function Icon(props: IconProps) {
  return <IconifyIcon {...props} />
}

export { Icon }
export type { IconProps }
