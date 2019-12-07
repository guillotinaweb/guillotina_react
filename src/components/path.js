import React from 'react';



export function Path({path, setPath}) {

  let segments = path.replace(/\/$/, "").split("/")
  let links = buildPaths(segments)

  if (segments.length === 1) {
    return false
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
      {segments.map((item, indx) =>
        <>
          {indx === 0 &&
            <li key={indx}>
              <a onClick={() => setPath(links[indx])}>
                <span class="icon">
                  <i class="fas fa-home"></i>
                </span>
              </a>
            </li>}
          {indx > 0 && <li key={indx}><a onClick={() => setPath(links[indx])}>
            {item}</a></li>}
        </>
      )}
      </ul>
    </nav>
  )

}


const buildPaths = (segments) => {
  let current = ""
  let results = []
  segments.map((item, indx) => {
    if (indx === 0) {
      current += "/"
    } else {
      current += item + "/"
    }
    results.push(current)
  })
  return results
}
