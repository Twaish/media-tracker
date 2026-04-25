import {
  closeWindow,
  maximizeWindow,
  minimizeWindow,
} from '@/app/window/actions'
import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface DragWindowRegionProps {
  title?: ReactNode
  children?: ReactNode
}

export default function DragWindowRegion({
  title,
  children,
}: DragWindowRegionProps) {
  return (
    <div className="z-50 flex h-8 w-full items-stretch justify-between border-b">
      <div className="draglayer flex w-full items-center">
        {title && (
          <div className="flex pr-1 pl-2 text-xs whitespace-nowrap opacity-65 select-none">
            {title}
          </div>
        )}
        {children}
      </div>
      <WindowButtons />
    </div>
  )
}

function WindowButtons() {
  return (
    <div className="m-1 flex">
      <Button
        variant={'ghost'}
        onClick={minimizeWindow}
        className="h-min px-2.25 py-1.5"
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
        </svg>
      </Button>

      <Button
        variant={'ghost'}
        onClick={maximizeWindow}
        className="h-min px-2.25 py-1.5"
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <rect
            width="9"
            height="9"
            x="1.5"
            y="1.5"
            fill="none"
            stroke="currentColor"
          ></rect>
        </svg>
      </Button>

      <Button
        variant={'ghost'}
        onClick={closeWindow}
        className="h-min px-2.25 py-1.5"
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <polygon
            fill="currentColor"
            fillRule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          ></polygon>
        </svg>
      </Button>
    </div>
  )
}
