import { useState, useCallback, useRef, useEffect } from 'react'

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
import { debounce, get } from '../../lib/utils'
import { SearchItem } from '../../types/guillotina'
import { Traversal } from '../../contexts'
import { IndexSignature } from '../../types/global'

interface State {
  page: number
  items: SearchItem[]
  loading: boolean
  items_total: number
}
const initialState: State = {
  page: 0,
  items: [],
  loading: false,
  items_total: 0,
}

interface Props {
  onChange: (value: string[]) => void
  error?: string
  errorZoneClassName?: string
  traversal: Traversal
  path?: string
  qs?: string[][]
  queryCondition?: string
  value: string[]
  btnClass?: string
  dataTestWrapper?: string
  dataTestSearchInput?: string
  dataTestItem?: string
  renderTextItemOption?: (item: SearchItem) => string
  typeNameQuery?: string
  labelProperty?: string
}

export const SearchInputList = ({
  onChange,
  error,
  errorZoneClassName,
  traversal,
  path = undefined,
  qs = [],
  queryCondition = 'id__in',
  value,
  btnClass = '',
  dataTestWrapper = 'wrapperSearchInputTest',
  dataTestSearchInput = 'searchInputTest',
  dataTestItem = 'searchInputItemTest',
  renderTextItemOption = undefined,
  typeNameQuery = undefined,
  labelProperty = 'id',
}: Props) => {
  const intl = useIntl()
  const [options, setOptions] = useSetState<State>(initialState)
  const [valuesLabel, setValuesLabels] = useState<IndexSignature | undefined>(
    undefined
  )
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef(null)
  const wrapperRef = useRef<HTMLInputElement>(null)
  const { PageSize, SearchEngine } = useConfig()
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

  const delayedQuery = useCallback<(value: string) => void>(
    debounce((value) => handleSearch(0, false, value), 500),
    []
  )

  const handleSearch = async (page = 0, concat = false, value = '') => {
    setOptions({ loading: true })
    let searchTermQs = ''
    let searchTermParsed: string[][] = []
    if (value !== '') {
      searchTermParsed = parser(`${queryCondition}=${value}`)
    }
    const { get } = traversal.registry
    const fnName = get('searchEngineQueryParamsFunction', SearchEngine)
    const qsParsed = traversal.client.getQueryParamsSearchFunction(fnName)({
      path: traversal.path,
      start: page * PageSize,
      pageSize: PageSize,
      withDepth: false,
    })
    const sortParsed = parser(`_sort_des=${labelProperty}`)
    let typeNameParsed: string[][] = []
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

    const data = await traversal.client.search<SearchItem>(
      path ? path : traversal.client.getContainerFromPath(traversal.path),
      searchTermQs,
      false,
      false
    )
    const newItems: SearchItem[] =
      options.items && concat ? [...options.items, ...data.items] : data.items

    setOptions({
      items: newItems ?? [],
      loading: false,
      items_total: data.items_total ?? 0,
      page: page,
    })
  }

  const inicializeLabels = async () => {
    if (labelProperty !== 'id' && value.length > 0) {
      setIsLoadingData(true)
      let searchTermQs = ''
      const searchTermParsed = ['__or', `id=${value.join('%26id=')}`]
      const { get: getSearch } = traversal.registry
      const fnName = getSearch('searchEngineQueryParamsFunction', SearchEngine)
      const qsParsed = traversal.client.getQueryParamsSearchFunction(fnName)({
        path: traversal.path,
        start: 0,
        pageSize: 100,
        withDepth: false,
      })
      let typeNameParsed: string[][] = []
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
      const data = await traversal.client.search<SearchItem>(
        path ? path : traversal.client.getContainerFromPath(traversal.path),
        searchTermQs,
        false,
        false
      )
      const newValuesLabel = data.items.reduce<IndexSignature<string>>(
        (result, item) => {
          result[item.id] = get(item, labelProperty, item.id)
          return result
        },
        {}
      )
      setValuesLabels(newValuesLabel)
      setIsLoadingData(false)
    }
  }

  const renderTextItemOptionFn = (
    item: SearchItem
  ): string | React.ReactNode => {
    if (renderTextItemOption) {
      return renderTextItemOption(item)
    }
    return get<string>(item, labelProperty, item.title) || item['@name']
  }

  useEffect(() => {
    if (!options.loading && !options.items && value.length > 0) {
      inicializeLabels()
    } else if (value.length === 0) {
      setValuesLabels({})
    }
  }, [path, options.loading, options.items])

  if (isLoadingData || valuesLabel === undefined) {
    return <div className="spinner" />
  }

  return (
    <>
      <div className="tags mb-2">
        {value.map((tag, index) => (
          <div
            key={`input_list_${tag}_${index}`}
            className="tag is-info is-medium"
          >
            {get(valuesLabel, tag, tag)}
            <button
              className="delete is-small"
              onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                onChange([
                  ...value.filter((tag) => value.indexOf(tag) !== index),
                ])
              }}
            ></button>
          </div>
        ))}
      </div>
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
              ev.preventDefault()
              setIsOpen(!isOpen)
              if (!options.loading && !options.items) {
                handleSearch(options.page)
              }
            }}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{intl.formatMessage(genericMessages.choose)}</span>

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
                      value.includes(item.id) ? 'is-active' : ''
                    }`}
                    data-test={`${dataTestItem}-${item.id}`}
                    onMouseDown={(ev) => {
                      ev.stopPropagation()
                      ev.preventDefault()
                      if (onChange && !value.includes(item.id)) {
                        setValuesLabels({
                          ...valuesLabel,
                          [item.id]: get(item, labelProperty, item.id),
                        })
                        onChange([...value, item.id])
                      }
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
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <ErrorZone className={errorZoneClassName} id={uid}>
          {error ? error : ''}
        </ErrorZone>
      )}
    </>
  )
}
