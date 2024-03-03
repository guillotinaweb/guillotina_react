import { noop } from '../../lib/helpers'
import { classnames } from '../../lib/helpers'

interface Props {
  children: React.ReactNode
  className?: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  onReset?: (event: React.FormEvent<HTMLFormElement>) => void
  autoComplete?: string
  title?: string
  error?: string
  dataTest?: string
}
export const Form = ({
  children,
  className = '',
  onSubmit = noop,
  onReset = noop,
  autoComplete = 'off',
  title,
  error,
  dataTest,
}: Props) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event)
  }
  return (
    <div data-test={dataTest}>
      {title && (
        <div className="level">
          <h1 className="title is-size-4">{title}</h1>
        </div>
      )}
      {error && <div className="notification is-danger">{error}</div>}
      <form
        onSubmit={handleSubmit}
        onReset={onReset}
        autoComplete={autoComplete}
        className={classnames(['form', className])}
      >
        {children}
      </form>
    </div>
  )
}
