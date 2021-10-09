import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { buildQs } from '../../lib/search'
import { parser } from '../../lib/search'
import useSetState from '../../hooks/useSetState'
import ErrorZone from '../error_zone'
import { Loading } from '../ui'
import { generateUID } from '../../lib/helpers'
import { useConfig } from '../../hooks/useConfig'
function debounce(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const initialState = {
  page: 0,
  items: undefined,
  loading: false,
  items_total: 0,
}

export const SearchInput = ({
  onChange,
  error,
  errorZoneClassName,
  traversal = null,
  path = null,
  qs = [],
  queryCondition = 'id__in',
  value,
  btnClass = '',
  dataTestWrapper = 'wrapperSearchInputTest',
  dataTestSearchInput = 'searchInputTest',
  dataTestItem = 'searchInputItemTest',
  renderTextItemOption = null,
}) => {
  const [options, setOptions] = useSetState(initialState)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const inputRef = React.useRef(null)
  const wrapperRef = React.useRef(null)
  const { PageSize, SearchEngine } = useConfig()

  const [uid] = useState(generateUID('search_input'))

  const getHeight = () => {
    if (wrapperRef && wrapperRef.current) {
      return {
        maxHeight: `${
          window.innerHeight -
          wrapperRef.current.getBoundingClientRect().top -
          100
        }px`,
      }
    }
    return { maxHeight: 'auto' }
  }

  const delayedQuery = React.useCallback(
    debounce((value) => handleSearch(0, false, value), 500),
    []
  )

  const handleSearch = async (page = 0, concat = false, value = '') => {
    setOptions({ loading: true })
    let searchTermQs = []
    let searchTermParsed = []
    if (value !== '') {
      searchTermParsed = parser(`${queryCondition}=${value}`)
    }
    const { get } = traversal.registry
    const fnName = get('searchEngineQueryParamsFunction', SearchEngine)
    let qsParsed = traversal.client[fnName]({
      path: traversal.path,
      start: page * PageSize,
      pageSize: PageSize,
    })

    if (qs.length > 0 || searchTermParsed.length > 0 || qsParsed.length > 0) {
      searchTermQs = buildQs([...qs, ...searchTermParsed, ...qsParsed])
    }

    const data = await traversal.client.search(
      path,
      searchTermQs,
      false,
      false,
      page * PageSize,
      PageSize
    )
    const newItems =
      options.items && concat ? [...options.items, ...data.items] : data.items

    setOptions({
      items: newItems ?? [],
      loading: false,
      items_total: data.items_total ?? 0,
      page: page,
    })
  }

  const renderTextItemOptionFn = (item) => {
    if (renderTextItemOption) {
      return renderTextItemOption(item)
    }
    return item.title || item['@name']
  }

  React.useEffect(() => {
    if (path && !options.loading && !options.items) {
      ;(async () => {
        handleSearch(options.page)
      })()
    }
  }, [path, options.loading, options.items])

  return (
    <React.Fragment>
      <div
        data-test={dataTestWrapper}
        ref={wrapperRef}
        className={`dropdown ${isOpen ? 'is-active' : ''}`}
        onBlur={(ev) => {
          if (!ev.currentTarget.contains(ev.relatedTarget)) {
            if (searchTerm !== '') {
              setSearchTerm('')
              setOptions(initialState)
            }
            setIsOpen(!isOpen)
          }
        }}
      >
        <div className="dropdown-trigger">
          <button
            className={`button ${btnClass}`}
            onClick={(ev) => {
              ev.preventDefault()
              setIsOpen(!isOpen)
            }}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{value && value.title ? value.title : 'Choose...'}</span>
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          style={getHeight()}
        >
          <div className="dropdown-content">
            <div className="dropdown-item">
              <input
                ref={inputRef}
                data-test={dataTestSearchInput}
                className="input"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(ev) => {
                  delayedQuery(ev.target.value)
                  setSearchTerm(ev.target.value)
                }}
              />
            </div>
            <hr className="dropdown-divider" />
            {options.loading && <Loading />}
            {options.items &&
              options.items.map((item) => {
                return (
                  <a
                    href="#"
                    className={`dropdown-item editable ${
                      value && value.id === item.id ? 'is-active' : ''
                    }`}
                    data-test={`${dataTestItem}-${item.id}`}
                    onMouseDown={() => {
                      onChange && onChange(item)
                      setIsOpen(false)
                    }}
                    key={item.path}
                  >
                    {renderTextItemOptionFn(item)}
                  </a>
                )
              })}

            {options.items && options.items.length === 0 && (
              <div className="dropdown-item"> No results </div>
            )}

            {options.items && options.items_total > options.items.length && (
              <React.Fragment>
                <hr className="dropdown-divider" />
                <div
                  className="dropdown-item editable"
                  onMouseDown={(ev) => {
                    ev.stopPropagation()
                    ev.preventDefault()
                    handleSearch(options.page + 1, true)
                  }}
                >
                  Load more...
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      {error && (
        <ErrorZone className={errorZoneClassName} id={uid}>
          {error ? error : ''}
        </ErrorZone>
      )}
    </React.Fragment>
  )
}

SearchInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
  client: PropTypes.object,
  path: PropTypes.string,
  PageSize: PropTypes.number,
  btnClass: PropTypes.string,
}
