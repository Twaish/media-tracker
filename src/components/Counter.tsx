import { useCountStore } from '@/stores/useCountStore'
import { Button } from './ui/button'

export default function Counter() {
  const count = useCountStore((s) => s.count)
  const increment = useCountStore((s) => s.increment)
  const decrement = useCountStore((s) => s.decrement)

  return (
    <div className="flex gap-2">
      <Button variant={'outline'} onClick={() => increment(1)} size={'sm'}>
        Inc
      </Button>
      <div className="flex items-center px-2">{count}</div>
      <Button variant={'outline'} onClick={() => decrement(1)} size={'sm'}>
        Dec
      </Button>
    </div>
  )
}
