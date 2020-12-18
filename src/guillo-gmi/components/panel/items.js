import React from 'react'
import { useContext } from 'react'

import useSetState from '../../hooks/useSetState'
import {
  ItemsActionsProvider,
  AllItemsCheckbox,
  ItemsActionsDropdown,
} from '../selected_items_actions'
import { Pagination } from '../pagination'
import { RItem } from '../item'
import { SearchLabels } from '../../components/searchLabels'
import { TraversalContext } from '../../contexts'
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

export function PanelItems(props) {
  const [location, setLocation] = useLocation()
  const { PageSize } = useConfig()

  const Ctx = useContext(TraversalContext)
  const [state, setState] = useSetState(initialState)
  const { items, loading, total } = state
  const columns = Ctx.client.getItemsColumn(items, Ctx.path)

  let search = location.get('q')
  let page

  try {
    page = parseInt(location.get('page')) || 0
  } catch {
    page = 0
  }

  let searchParsed = undefined
  if (search && search !== '') {
    searchParsed = parser(search)
  }

  useEffect(() => {
    if (Ctx.state.loading) return
    ;(async () => {
      let data
      setState({ loading: true, total: Ctx.context.length })
      if (search) {
        let qs = buildQs(searchParsed)
        data = await Ctx.client.search(
          Ctx.path,
          qs,
          false,
          false,
          page * PageSize,
          PageSize
        )
      } else {
        data = await Ctx.client.getItems(Ctx.path, page * PageSize, PageSize)
      }
      setState({
        items: data.member,
        loading: false,
        total: data.items_count,
      })
    })()
  }, [search, Ctx.state.refresh, page])

  const doPaginate = (page) => {
    setLocation({ page: page })
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
        <table className="table is-fullwidth is-hoverable">
          <thead className="is-size-7">
            <tr>
              <th>
                <AllItemsCheckbox />
              </th>
              {columns.map((i) => (
                <th key={i.label} className="has-text-info">
                  {i.label}
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
                  setPath={Ctx.setPath}
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
