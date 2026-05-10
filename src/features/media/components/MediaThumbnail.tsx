import { ComponentProps } from 'react'
import defaultImage from '@/assets/images/default.jpg'
import { cn } from '@/utils/tailwind'

export function MediaThumbnail({
  className,
  onError,
  src,
  ...props
}: Omit<ComponentProps<'img'>, 'src'> & { src?: string | null }) {
  return (
    <img
      src={src ? `images://${src}` : defaultImage}
      onError={(e) => {
        e.currentTarget.src = defaultImage
        onError?.(e)
      }}
      className={cn('object-cover object-center', className)}
      {...props}
    />
  )
}
