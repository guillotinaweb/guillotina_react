import React, { useState, useEffect, useCallback } from 'react'

import PropTypes from 'prop-types'
import { buildQs } from '../../lib/search'
import { parser } from '../../lib/search'
import useSetState from '../../hooks/useSetState'
import ErrorZone from '../error_zone'
import { Loading } from '../ui'
import { generateUID } from '../../lib/helpers'
import { useConfig } from '../../hooks/useConfig'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import useClickAway from '../../hooks/useClickAway'
import { get } from '../../lib/utils'
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
  typeNameQuery = null,
  labelProperty = 'id',
}) => {
  const intl = useIntl()
  const [options, setOptions] = useSetState(initialState)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const inputRef = React.useRef(null)
  const wrapperRef = React.useRef(null)
  const { PageSize, SearchEngine } = useConfig()
  const [valueLabel, setValueLabel] = useState(undefined)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [uid] = useState(generateUID('search_input'))

  useClickAway(wrapperRef, () => {
    setIsOpen(false)
  })

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

  const delayedQuery = useCallback(
    debounce((value) => handleSearch(0, false, value), 500),
    []
  )

  const inicializeLabels = async () => {
    if (labelProperty !== 'id' && value) {
      setIsLoadingData(true)
      let searchTermQs = []
      const searchTermParsed = [`id`, value]
      const { get: getSearch } = traversal.registry
      const fnName = getSearch('searchEngineQueryParamsFunction', SearchEngine)
      const qsParsed = traversal.client[fnName]({
        path: traversal.path,
        start: 0,
        pageSize: PageSize,
        withDepth: false,
      })
      let typeNameParsed = []
      if (typeNameQuery) {
        typeNameParsed = parser(`type_name__in=${typeNameQuery}`)
      }
      if (
        qs.length > 0 ||
        searchTermParsed.length > 0 ||
        qsParsed.length > 0 ||
        typeNameParsed.length > 0
      ) {
        searchTermQs = buildQs([
          ...qs,
          searchTermParsed,
          ...qsParsed,
          ...typeNameParsed,
        ])
      }
      const data = await traversal.client.search(
        path ? path : traversal.client.getContainerFromPath(traversal.path),
        searchTermQs,
        false,
        false
      )
      const newValuesLabel = data.items.reduce((result, item) => {
        result[item.id] = get(item, labelProperty, item.id)
        return result
      }, {})
      setValueLabel(newValuesLabel)
      setIsLoadingData(false)
    }
  }

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
      withDepth: false,
    })
    let sortParsed = parser(`_sort_des=title`)
    let typeNameParsed = []
    if (typeNameQuery) {
      typeNameParsed = parser(`type_name__in=${typeNameQuery}`)
    }

    if (
      qs.length > 0 ||
      searchTermParsed.length > 0 ||
      qsParsed.length > 0 ||
      typeNameParsed.length > 0
    ) {
      searchTermQs = buildQs([
        ...qs,
        ...searchTermParsed,
        ...qsParsed,
        ...typeNameParsed,
        ...sortParsed,
      ])
    }

    const data = await traversal.client.search(
      path ? path : traversal.client.getContainerFromPath(traversal.path),
      searchTermQs,
      false,
      false
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

  useEffect(() => {
    if (value) {
      inicializeLabels()
    } else {
      setValueLabel({})
    }
  }, [path, value])

  if (valueLabel === undefined) {
    return <div className="spinner" />
  }

  return (
    <React.Fragment>
      <div
        data-test={dataTestWrapper}
        ref={wrapperRef}
        className={`dropdown mb-2 ${isOpen ? 'is-active' : ''}`}
        onBlur={(ev) => {
          if (!ev.currentTarget.contains(ev.relatedTarget)) {
            if (searchTerm !== '') {
              setSearchTerm('')
              setOptions(initialState)
            }
            setIsOpen(false)
          }
        }}
      >
        <div className="dropdown-trigger">
          <button
            className={`button ${btnClass}`}
            onClick={(ev) => {
              ev.target.blur()
              setIsOpen(!isOpen)
              if (!options.loading && !options.items) {
                handleSearch(options.page)
              }
            }}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>
              {value
                ? get(valueLabel, value, value)
                : intl.formatMessage(genericMessages.choose)}
            </span>
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
                placeholder={intl.formatMessage(genericMessages.search)}
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
                  <div
                    className={`dropdown-item editable ${
                      value === item.id ? 'is-active' : ''
                    }`}
                    data-test={`${dataTestItem}-${item.id}`}
                    onMouseDown={(ev) => {
                      ev.preventDefault()
                      if (onChange) {
                        onChange(item.id)
                      }
                      setIsOpen(false)
                    }}
                    key={item.path}
                  >
                    {renderTextItemOptionFn(item)}
                  </div>
                )
              })}

            {options.items && options.items.length === 0 && (
              <div className="dropdown-item">
                {intl.formatMessage(genericMessages.no_results)}
              </div>
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
                  {intl.formatMessage(genericMessages.load_more)}
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
  value: PropTypes.string,
  path: PropTypes.string,
  btnClass: PropTypes.string,
  error: PropTypes.string,
  errorZoneClassName: PropTypes.string,
  traversal: PropTypes.object,
  qs: PropTypes.array,
  queryCondition: PropTypes.string,
  dataTestWrapper: PropTypes.string,
  dataTestSearchInput: PropTypes.string,
  dataTestItem: PropTypes.string,
  renderTextItemOption: PropTypes.func,
  typeNameQuery: PropTypes.string,
  labelProperty: PropTypes.string,
}
