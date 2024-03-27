import useSetState from '../../hooks/useSetState'
import {
  ItemsActionsProvider,
  AllItemsCheckbox,
  ItemsActionsDropdown,
} from '../selected_items_actions'
import { Pagination } from '../pagination'
import { RItem } from '../item'
import { SearchLabels } from '../search_labels'
import { SearchOptionsLabels } from '../search_options_labels'
import { SearchVocabularyLabels } from '../search_vocabulary_labels'
import { useTraversal } from '../../contexts'
import { buildQs } from '../../lib/search'
import { parser } from '../../lib/search'
import { useConfig } from '../../hooks/useConfig'
import { useEffect } from 'react'
import { useLocation } from '../../hooks/useLocation'
import { Select } from '../input/select'
import { Input } from '../input/input'
import { SelectVocabulary } from '../input/select_vocabulary'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

import { RegistrySchemaFilter, SearchItem } from '../../types/guillotina'

interface InitialState {
  page: number
  items: SearchItem[]
  loading: boolean
  total: number
}
const initialState: InitialState = {
  page: 0,
  items: [],
  loading: true,
  total: 0,
}

export function PanelItems() {
  const [location, setLocation, del] = useLocation()
  const { PageSize, SearchEngine } = useConfig()
  const intl = useIntl()

  const Ctx = useTraversal()
  const [state, setState] = useSetState<InitialState>(initialState)
  const { items, loading, total } = state

  const filterSchema: RegistrySchemaFilter[] =
    Ctx.registry.getSchemas(Ctx.context['@type']).filters || []

  const columns =
    Ctx.registry.getItemsColumn(Ctx.context['@type']) ||
    Ctx.client.getItemsColumn()

  const search = location.get('q')
  const type = location.get('type')
  const sort = location.get('sort')
  const sortDirection = location.get('sort_direction')
  let page: number

  try {
    page = parseInt(location.get('page') || '0')
  } catch {
    page = 0
  }

  let searchParsed: string[][] | undefined = undefined
  if (search && search !== '') {
    const fieldsToFilter = Ctx.registry.getFieldsToFilter(Ctx.context['@type'])
    searchParsed = parser(search, fieldsToFilter)
  }

  let typeParsed: string[][] | undefined = undefined
  if (type && type !== '') {
    typeParsed = parser(type, 'type_name')
  }

  let sortParsed: string[][] | undefined = undefined
  if (sort && sort !== '') {
    if (sortDirection === 'asc') {
      sortParsed = parser(`_sort_asc=${sort}`)
    } else if (sortDirection === 'des') {
      sortParsed = parser(`_sort_des=${sort}`)
    }
  }

  const onSort = (key: string) => {
    if (sort === key && sortDirection === 'des') {
      setLocation({
        sort: key,
        sort_direction: 'asc',
        page: 0,
      })
    } else {
      setLocation({
        sort: key,
        sort_direction: 'des',
        page: 0,
      })
    }
  }

  let resultQueryParams: string[][] = []
  const resultDynamicLocation: string[] = []
  filterSchema.forEach((filter) => {
    const itemParam = location.get(filter.attribute_key) || ''
    resultDynamicLocation.push(itemParam)
    if (itemParam) {
      const filterParsed = parser(itemParam, filter.attribute_key)
      resultQueryParams = [...resultQueryParams, ...filterParsed]
    }
  })

  useEffect(() => {
    const controller = new AbortController()
    if (Ctx.state.loading) return
    ;(async () => {
      setState({ loading: true, total: Ctx.context.length })
      const { get } = Ctx.registry
      const fnName = get('searchEngineQueryParamsFunction', SearchEngine)
      if (sortParsed === undefined) {
        const defaultSortValue = Ctx.registry.getDefaultSortValue(
          Ctx.context['@type']
        )
        sortParsed = parser(
          `_sort_${defaultSortValue.direction}=${defaultSortValue.key}`
        )
      }
      const qsParsed = Ctx.client.getQueryParamsSearchFunction(fnName)({
        path: Ctx.path,
        start: page * PageSize,
        pageSize: PageSize,
      })
      let qs = ''
      if (search || type || resultQueryParams.length > 0) {
        qs = buildQs([
          ...qsParsed,
          ...(searchParsed ?? []),
          ...(typeParsed ?? []),
          ...(sortParsed ?? []),
          ...resultQueryParams,
        ])
      } else {
        qs = buildQs([...qsParsed, ...(sortParsed ?? [])])
      }

      const { signal } = controller
      const data = await Ctx.client.search(Ctx.path, qs, false, false, {
        signal,
      })
      setState({
        items: data.member,
        loading: false,
        total: data.items_count,
      })
    })()
    return () => {
      controller.abort()
    }
  }, [
    search,
    type,
    Ctx.state.refresh,
    page,
    sort,
    sortDirection,
    ...resultDynamicLocation,
  ])

  const doPaginate = (page) => {
    setLocation({ page: page })
  }

  const getIcon = (key, isSortable) => {
    let icon = null
    if (isSortable) {
      if (sort !== key) {
        icon = <i className="fas fa-sort" />
      } else if (sortDirection === 'des') {
        icon = <i className="fas fa-sort-down" />
      } else {
        icon = <i className="fas fa-sort-up"></i>
      }
    }
    return <span className="icon is-small">{icon}</span>
  }

  return (
    <ItemsActionsProvider items={items}>
      {filterSchema.length > 0 && (
        <div className="filters-items-view">
          {filterSchema.map((filter) => {
            if (filter.type === 'select' && (filter.values ?? []).length > 0) {
              return (
                <Select
                  key={`filter-${filter.attribute_key}`}
                  id={filter.attribute_key}
                  placeholder={filter.label}
                  appendDefault
                  classWrap="is-size-7 is-fullwidth"
                  options={filter.values}
                  value={location.get(filter.attribute_key) || ''}
                  dataTest={`filterInput${filter.attribute_key}`}
                  onChange={(value) => {
                    if (value && value !== '') {
                      setLocation({
                        [filter.attribute_key]: value,
                        tab: 'Items',
                        page: 0,
                      })
                    } else {
                      del(filter.attribute_key)
                    }
                  }}
                />
              )
            } else if (filter.type === 'select' && filter.vocabulary) {
              return (
                <SelectVocabulary
                  key={`filter-${filter.attribute_key}`}
                  id={filter.attribute_key}
                  placeholder={filter.label}
                  appendDefault
                  vocabularyName={filter.vocabulary}
                  classWrap="is-size-7 is-fullwidth"
                  val={location.get(filter.attribute_key) || ''}
                  dataTest={`filterInput${filter.attribute_key}`}
                  onChange={(value) => {
                    if (value && value !== '') {
                      setLocation({
                        [filter.attribute_key]: value,
                        tab: 'Items',
                        page: 0,
                      })
                    } else {
                      del(filter.attribute_key)
                    }
                  }}
                />
              )
            } else if (filter.type === 'input') {
              return (
                <Input
                  id={filter.attribute_key}
                  key={`filter-${filter.attribute_key}`}
                  placeholder={filter.label}
                  className="is-size-7 is-fullwidth"
                  type={filter.input_type || 'text'}
                  value={location.get(filter.attribute_key) || ''}
                  dataTest={`filterInput${filter.attribute_key}`}
                  onChange={(value) => {
                    if (value && value !== '') {
                      setLocation({
                        [filter.attribute_key]: value,
                        tab: 'Items',
                        page: 0,
                      })
                    } else {
                      del(filter.attribute_key)
                    }
                  }}
                />
              )
            }
            return null
          })}
        </div>
      )}
      <div className="wrapper-filters-info">
        <div className="is-size-7">
          <ItemsActionsDropdown />
        </div>
        <div className="wrapper-filters-tags">
          {location.get('q') && <SearchLabels />}
          {location.get('type') && <SearchLabels query="type" />}

          {(filterSchema ?? []).map((filter) => {
            const filterData = location.get(filter.attribute_key)
            if (filterData) {
              if (filter.type === 'select' && filter.vocabulary) {
                return (
                  <div key={filter.attribute_key}>
                    <SearchVocabularyLabels
                      query={filter.attribute_key}
                      vocabularyName={filter?.vocabulary}
                    />
                  </div>
                )
              } else if (
                filter.type === 'select' &&
                (filter.values ?? []).length > 0
              ) {
                return (
                  <div key={filter.attribute_key}>
                    <SearchOptionsLabels
                      query={filter.attribute_key}
                      options={filter?.values}
                    />
                  </div>
                )
              }
              return (
                <div key={filter.attribute_key}>
                  <SearchLabels query={filter.attribute_key} />
                </div>
              )
            }
            return null
          })}
        </div>
        <div>
          <Pagination
            current={page}
            total={total}
            key="pagination-top"
            doPaginate={doPaginate}
            pager={PageSize}
          />
        </div>
      </div>

      {loading && <div className="progress-line"></div>}
      {!loading && (
        <table
          className="table is-fullwidth is-hoverable"
          data-test="itemPanelTableTest"
        >
          <thead className="is-size-7">
            <tr>
              <th>
                <AllItemsCheckbox />
              </th>
              {columns.map((column) => (
                <th
                  key={`table-col-${column.label}`}
                  onClick={() => column.isSortable && onSort(column.key)}
                  data-test={`sortableColumn${column.key}`}
                >
                  <div className="has-text-info is-flex is-align-items-center">
                    <span>{column.label}</span>
                    {getIcon(column.key, column.isSortable)}
                  </div>
                </th>
              ))}
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item) => (
                <RItem
                  item={item}
                  key={item['@uid']}
                  search={search}
                  columns={columns}
                />
              ))}
            {items && items.length === 0 && (
              <tr>
                <td colSpan={6} className="has-text-centered">
                  {intl.formatMessage(genericMessages.no_results)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="columns is-centered">
        <Pagination
          current={page}
          key="pagination-bottom"
          total={total}
          doPaginate={doPaginate}
          pager={PageSize}
        />
      </div>
    </ItemsActionsProvider>
  )
}
