import { classnames } from '../../lib/helpers'

interface Props {
  headers?: string[]
  className?: string
  children: React.ReactNode
}
export function Table({ headers, children, className }: Props) {
  const parsedClassName = className
    ? className.split(' ')
    : ' is-full is-fullwidth is-narrow'.split(' ')
  return (
    <table className={classnames(['table', ...parsedClassName])}>
      <thead>
        <tr>
          {headers &&
            headers.map((item, idx) => <th key={item + idx}>{item}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
