import React from 'react'

const plain = ['string', 'number', 'boolean']

export function RenderField({ value, Widget }) {
  if (value === null || value === undefined) return ''

  if (Widget) {
    return <Widget value={value} />
  }

  const type = typeof value
  if (plain.includes(type)) {
    return value
  }
  if (type === 'object') {
    if (Array.isArray(value)) {
      return value.map((item) => (
        <div key={item}>
          <RenderField value={item} />
        </div>
      ))
    }
    return Object.keys(value).map((key) => (
      <FieldValue field={key} value={value[key]} key={key} />
    ))
  }
  return <p>No render for {JSON.stringify(value)}</p>
}

const FieldValue = ({ field, value }) => (
  <div className="field">
    <div className="label">{field}</div>
    <div className="value">
      <RenderField value={value} />
    </div>
  </div>
)
