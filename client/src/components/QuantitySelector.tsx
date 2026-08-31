import { MinusIcon, PlusIcon } from 'lucide-react'
import { cn } from '../util/util'

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  className?: string
  buttonClassName?: string
  disableIncrease?: boolean
  disableDecrease?: boolean
}

export const QuantitySelector = (props: QuantitySelectorProps) => {
  const {
    quantity,
    onIncrease,
    onDecrease,
    className,
    disableDecrease,
    disableIncrease,
    buttonClassName
  } = props

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        className={cn('btn', buttonClassName)}
        onClick={onDecrease}
        disabled={disableDecrease}
      >
        <MinusIcon />
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        className={cn('btn', buttonClassName)}
        onClick={onIncrease}
        disabled={disableIncrease}
      >
        <PlusIcon />
      </button>
    </div>
  )
}
