
import React from 'react'

export const Icon = ({icon, css}) => (
  <span className={'icon' + css}>
    <i className={icon}></i>
  </span>
)

