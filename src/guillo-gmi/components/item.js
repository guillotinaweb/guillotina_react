import React from 'react'

import { ItemModel } from '../models'
import { useLocation } from '../hooks/useLocation'
import { useTraversal } from '../contexts'
import { Icon } from './ui/icon'
import { ItemCheckbox } from './selected_items_actions'
import { Delete } from './ui'

export function Item({ item, icon }) {
  const [, navigate] = useLocation()
  const link = () => navigate({path: item.path}, true)
  return (
    <tr>
      <td onClick={link} style={{ width: '25px' }}>
        {icon && <Icon icon={icon} />}
      </td>
      <td onClick={link}>{item.id}</td>
    </tr>
  )
}

const smallcss = {
  width: 25,
}

export function RItem({ item, search, columns }) {
  const [, navigate] = useLocation()
  const traversal = useTraversal()
  const model = new ItemModel(item, traversal.url, traversal.path)
  const link = () => navigate({path: model.path}, true)

  return (
    <tr key={item}>
      <td style={smallcss}>
        <ItemCheckbox item={item} />
      </td>
      {columns.map((i) => (
        <React.Fragment key={i.label}>
          {i.child(model, link, search)}
        </React.Fragment>
      ))}
      <td style={smallcss}>
        {traversal.hasPerm('guillotina.DeleteContent') && (
          <Delete
            onClick={() =>
              traversal.doAction('removeItems', { items: [model.item] })
            }
          />
        )}
      </td>
    </tr>
  )
}

export function ItemTitle({ title, actions }) {
  return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <h4 className="title has-text-primary is-size-5">{title}</h4>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">{actions && actions}</div>
      </div>
    </nav>
  )
}
