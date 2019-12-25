import React from 'react'

import {Icon} from '../ui/icon'

export function IDublinCore(props) {
  return (
    <React.Fragment>
      {Object.keys(props).map(key => (
        <tr>
          <td>{key}</td>
          <td>{props[key]}</td>
          <td></td>
        </tr>
      ))}
    </React.Fragment>
  );
}



export function Author({ name }) {
  return (
    <div className="container">
      <Icon icon="fas fa-user" />
      <span>{name}</span>
    </div>
  );
}
