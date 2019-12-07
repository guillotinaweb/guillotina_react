import React from 'react';

import {Container, LevelLeft, LevelRight, LevelItem} from 'bloomer'
import {Delete} from 'bloomer'
import {ItemModel} from '../models'


const styles = {
  borderBottom: '1px solid #eaeaea',
  cursor: 'pointer',
  padding: '0'
}

const stylesTitle = {
  paddingBottom: '10px',
  // backgroundColor: '#eaeaea'
}

export function Item({item, setPath, icon}) {
  const link = () => setPath(item.path)
  return (
    <tr>
      <td onClick={link} style={{width: '25px'}}>{icon && <Icon icon={icon} />}</td>
      <td onClick={link}>{item.id}</td>
    </tr>
  )
}

const smallcss = {
  width: '25px'
}

export function RItem({item, setPath}) {

  const model = new ItemModel(item)
  const link = () => setPath(model.path)
  const icon = undefined

  return (
    <tr>
      <td onClick={link} style={smallcss}>{<Icon icon={model.icon} />}</td>
      <td style={smallcss}><span className="tag">{model.type}</span></td>
      <td onClick={link}>{model.name}</td>
      <td style={smallcss}>
        <Delete />
      </td>
    </tr>
  )
}

export function Item2({item, setPath, icon}) {
  return (
    <div className="level" style={styles}>
      <div className="tile" onClick={() => setPath(item.path)}>
        {icon && <Icon icon={icon} />}
        {item.id}
      </div>
      <div className="tile is-2"></div>
    </div>
  )
}



export function ItemTitle({title, actions}) {
  return (
    <nav className="level">
      <LevelLeft>
        <LevelItem>
          <h4 className="title has-text-primary is-size-5">{title}</h4>
        </LevelItem>
      </LevelLeft>
      <LevelRight>
        <LevelItem>
          {actions && actions}
        </LevelItem>
      </LevelRight>
    </nav>
  )
}


export function Icon({icon}) {
  return (
    <span className="icon">
        <i className={icon}></i>
    </span>
  )
}
