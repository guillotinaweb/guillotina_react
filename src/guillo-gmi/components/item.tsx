import React from 'react'

import { ItemModel } from '../models'
import { useLocation } from '../hooks/useLocation'
import { useTraversal } from '../contexts'
import { Icon } from './ui/icon'
import { ItemCheckbox } from './selected_items_actions'
import { Delete } from './ui'
import {
  GuillotinaCommonObject,
  ItemColumn,
  SearchItem,
} from '../types/guillotina'

interface ItemProps {
  item: { id: string; path: string }
  icon?: string
}
export function Item({ item, icon }: ItemProps) {
  const [, navigate] = useLocation()
  const link = () => navigate({ path: item.path }, true)
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

interface RItemProps {
  item: SearchItem
  search: string
  columns: ItemColumn<SearchItem | GuillotinaCommonObject>[]
}
export function RItem({ item, search, columns }: RItemProps) {
  const [, navigate] = useLocation()
  const traversal = useTraversal()
  const model = new ItemModel(item, traversal.url)
  const link = () => navigate({ path: model.path }, true)

  return (
    <tr key={item.id} data-test={`itemTest-${item.id}`}>
      <td style={smallcss}>
        <ItemCheckbox item={item} dataTest="itemCheckboxRowTest" />
      </td>
      {columns.map((i) => (
        <React.Fragment key={i.label}>
          {i.child({ model, link, search })}
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

interface ItemTitleProps {
  title: string
  actions?: React.ReactNode
}
export function ItemTitle({ title, actions }: ItemTitleProps) {
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
