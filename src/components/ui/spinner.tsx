import { cn } from 'cn'

import { appIcons } from '@/config/icons'
import { Icon, type IconProps } from '@/components/ui/icon'

function Spinner({ className, ...props }: Omit<IconProps, 'icon'>) {
  return (
    <Icon
      icon={appIcons.refresh}
      data-slot='spinner'
      role='status'
      aria-label='Loading'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
