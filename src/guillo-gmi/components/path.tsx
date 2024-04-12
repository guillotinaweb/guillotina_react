import { useTraversal } from '../contexts'
import { useLocation } from '../hooks/useLocation'

export function Path() {
  const ctx = useTraversal()
  const [, navigate] = useLocation()

  const segments = ctx.path.replace(/\/$/, '').split('/')
  const links = buildPaths(segments)

  if (segments.length === 1) {
    return null
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        {segments.map((item, indx) => {
          const path = links[indx]
          const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (e.ctrlKey || e.metaKey) return
            e.preventDefault()
            navigate({ path }, true)
          }

          return indx === 0 ? (
            <li key={indx}>
              <a
                href={path}
                onClick={onClick}
                data-test={`breadcrumbItemTest-home`}
              >
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
              </a>
            </li>
          ) : (
            <li key={indx}>
              <a
                href={path}
                onClick={onClick}
                data-test={`breadcrumbItemTest-${item.toLowerCase()}`}
              >
                {item}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const buildPaths = (segments: string[]) => {
  let current = ''
  const results: string[] = []
  segments.map((item, indx) => {
    if (indx === 0) {
      current += '/'
    } else {
      current += item + '/'
    }
    results.push(current)
    return item
  })
  return results
}
