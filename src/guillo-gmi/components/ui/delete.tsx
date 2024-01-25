import { MouseEvent } from 'react'

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
  children?: React.ReactNode
}
export function Delete({ onClick, className = '', children = null }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`delete ${className}`}
      data-test="btnDeleteTest"
    >
      {children}
    </button>
  )
}
