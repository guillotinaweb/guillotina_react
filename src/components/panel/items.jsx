import React from 'react'
import {useContext} from 'react'
import {useSetState} from 'react-use'
import {useEffect} from 'react'
import {TraversalContext} from '../../contexts'
import {RItem} from '../item'
import {Pagination} from '../pagination'


const initialState = {
  page: 0,
  items: [],
  loading: true
}

export function PanelItems(props) {
  const Ctx = useContext(TraversalContext)
  const [state, setState] = useSetState(initialState)
  const {items, page, loading} = state

  useEffect(() => {
    (async () => {
      let data = await Ctx.client.getItems(Ctx.path, page*Ctx.PAGE_SIZE)
      setState({
        items: data.member,
        loading: false
      })
    })()
  }, [page, Ctx.context])

  const doPaginate = (page) => setState({loading:true, page})

  return (
    <>
      <p className="has-text-right">
        <strong>{Ctx.context.length} items</strong>&nbsp;
      </p>
      <table className="table is-fullwidth is-hoverable">
        {!loading && <thead>
          <tr>
            <th></th>
            <th>type</th>
            <th>id/name</th>
            <th>modified</th>
            <th>created</th>
            <th>actions</th>
          </tr>
        </thead>}
        {!loading && <tbody>
        {items.map(item =>
          <RItem item={item} setPath={Ctx.setPath} key={item["@uid"]} />
        )}
        {items.length === 0 && <tr><td
          colspan="6" className="has-text-centered">Anything here!</td></tr> }
        </tbody>}
      </table>
      <Pagination current={state.page}
          total={Ctx.context.length}
          doPaginate={doPaginate}
          pager={Ctx.PAGE_SIZE}
        />
    </>
  )
}


