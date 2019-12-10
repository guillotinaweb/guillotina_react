import React from 'react';
import {useEffect} from 'react'
import {useSetState} from '../hooks/setstate'
import {useRef} from 'react'
import {useContext} from 'react'
import {TraversalContext} from '../contexts'
import {useClickAway} from 'react-use';

/* eslint jsx-a11y/anchor-is-valid: "off" */
const initialState = {
  types: undefined,
  isActive: false
}

export function CreateButton(props) {

  const ref = useRef(null)
  const [state, setState] = useSetState(initialState)
  const Ctx = useContext(TraversalContext)

  useEffect(() => {
    (async function anyNameFunction() {
      const types = await Ctx.client.getTypes(Ctx.context["@id"])
      setState({types})
    })();
  }, [Ctx.context["@id"]])

  useClickAway(ref, () => {
    setState({isActive: false})
  });


  const doAction = (item) => () => {
    Ctx.doAction('addItem', {type:item})
    setState({isActive: false})
  }



  const status = (state.isActive) ? 'dropdown is-right is-active' : 'dropdown is-right'

  return (
    <div className={status} ref={ref}>
      <div className="dropdown-trigger">
        <button className="button"
          onClick={()=>setState({isActive: !state.isActive})}
          aria-haspopup="true" aria-controls="dropdown-menu">
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {state.types && state.types.map(item =>
          <a className="dropdown-item"
            key={item}
            onClick={doAction(item)}
            >{item}</a>)}
        </div>
      </div>
  </div>
  )
}


export function ContextToolbar(props) {
  return (
    <>
      <div className="level-item">
        <form action="" className="form"
          onSubmit={(ev) => alert('submit')}>
            <input type="text" className="input"
              placeholder="Search" />
        </form>
      </div>
      <div className="level-item">
        <CreateButton {... props} />
      </div>
    </>
  )
}
