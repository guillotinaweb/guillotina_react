import React from 'react'

import useSetState from '../../hooks/useSetState'
import {
  ItemsActionsProvider,
  AllItemsCheckbox,
  ItemsActionsDropdown,
} from '../selected_items_actions'
import { Pagination } from '../pagination'
import { RItem } from '../item'
import { SearchLabels } from '../../components/searchLabels'
import { useTraversal } from '../../contexts'
import { buildQs } from '../../lib/search'
import { parser } from '../../lib/search'
import { useConfig } from '../../hooks/useConfig'
import { useEffect } from 'react'
import { useLocation } from '../../hooks/useLocation'

const initialState = {
  page: 0,
  items: [],
  loading: true,
  total: 0,
}

export function PanelItems() {
  const [location, setLocation] = useLocation()
  const { PageSize, SearchEngine } = useConfig()

  const Ctx = useTraversal()
  const [state, setState] = useSetState(initialState)
  const { items, loading, total } = state

  const columns =
    Ctx.registry.getItemsColumn(Ctx.context['@type']) ||
    Ctx.client.getItemsColumn()

  let search = location.get('q')
  let type = location.get('type')
  let sort = location.get('sort')
  const sortDirection = location.get('sort_direction')
  let page

  try {
    page = parseInt(location.get('page')) || 0
  } catch {
    page = 0
  }

  let searchParsed = undefined
  if (search && search !== '') {
    const fieldsToFilter = Ctx.registry.getFieldsToFilter(Ctx.context['@type'])
    searchParsed = parser(search, fieldsToFilter)
  }

  let typeParsed = undefined
  if (type && type !== '') {
    typeParsed = parser(type, 'type_name')
  }

  let sortParsed = undefined
  if (sort && sort !== '') {
    if (sortDirection === 'asc') {
      sortParsed = parser(`_sort_asc=${sort}`)
    } else if (sortDirection === 'des') {
      sortParsed = parser(`_sort_des=${sort}`)
    }
  }

  const onSort = (key) => {
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

  useEffect(() => {
    if (Ctx.state.loading) return
    ;(async () => {
      let data
      setState({ loading: true, total: Ctx.context.length })
      const { get } = Ctx.registry
      const fnName = get('searchEngineQueryParamsFunction', SearchEngine)

      let qsParsed = Ctx.client[fnName]({
        path: Ctx.path,
        start: page * PageSize,
        pageSize: PageSize,
      })
      let qs = ''
      if (search || type || sort) {
        qs = buildQs([
          ...qsParsed,
          ...(searchParsed ?? []),
          ...(typeParsed ?? []),
          ...(sortParsed ?? []),
        ])
      } else {
        qs = buildQs(qsParsed)
      }

      data = await Ctx.client.search(
        Ctx.path,
        qs,
        false,
        false,
        page * PageSize,
        PageSize
      )
      setState({
        items: data.member,
        loading: false,
        total: data.items_count,
      })
    })()
  }, [search, type, Ctx.state.refresh, page, sort, sortDirection])

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
      <div className="columns">
        <div className="column is-2 is-size-7">
          <ItemsActionsDropdown />
        </div>
        <div className="column">
          <SearchLabels />
        </div>
        <div className="column">
          <SearchLabels label="Type" query="type" />
        </div>
        <div className="column">
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
                  key={column.label}
                  onClick={() => column.isSortable && onSort(column.key)}
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
                <td colSpan="6" className="has-text-centered">
                  Anything here!
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
