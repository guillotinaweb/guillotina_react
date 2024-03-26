import { classnames } from '../../lib/helpers'

interface Props {
  children: React.ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'reset' | 'button'
  loading?: boolean
  disabled?: boolean
  dataTest?: string
}
export const Button = ({
  children,
  className = 'is-primary',
  onClick,
  type = 'submit',
  loading = false,
  disabled = false,
  dataTest,
}: Props) => {
  let css = [...className.split(' '), 'button']
  if (loading) css = css.concat('is-loading')

  return (
    <p className="control">
      <button
        type={type}
        className={classnames(css)}
        onClick={onClick}
        disabled={disabled}
        data-test={dataTest}
      >
        {children}
      </button>
    </p>
  )
}
