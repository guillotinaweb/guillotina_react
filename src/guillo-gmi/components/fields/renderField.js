import React from 'react'
import { DownloadField } from './downloadField'
import { useVocabulary } from '../../hooks/useVocabulary'
import { get } from '../../lib/utils'
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

export const DEFAULT_VALUE_EDITABLE_FIELD = 'Click to edit'
export const DEFAULT_VALUE_NO_EDITABLE_FIELD = ' -- '

export function RenderFieldComponent({ schema, field, val, modifyContent }) {
  const getRenderProps = () => {
    const renderProps = {
      value:
        val ??
        (modifyContent
          ? DEFAULT_VALUE_EDITABLE_FIELD
          : DEFAULT_VALUE_NO_EDITABLE_FIELD),
    }
    if (val && schema?.widget === 'file') {
      renderProps['value'] = {
        data: val,
        field: field,
      }
      renderProps['Widget'] = DownloadField
    } else if (schema?.type === 'boolean') {
      renderProps['value'] = val?.toString() ?? renderProps['value']
    } else if (val && schema?.type === 'datetime') {
      renderProps['value'] = new Date(val).toLocaleString()
    } else if (schema?.items?.vocabularyName || schema?.vocabularyName) {
      const vocabularyName =
        schema?.items?.vocabularyName || schema?.vocabularyName
      const vocabulary = useVocabulary(vocabularyName)
      if (schema?.vocabularyName) {
        const vocabularyValue = get(vocabulary, 'data.items', []).find(
          (item) => item.token === val
        )
        renderProps['value'] = vocabularyValue?.title ?? ''
      } else {
        renderProps['value'] = (renderProps['value'] ?? []).map((value) => {
          return (
            get(vocabulary, 'data.items', []).find(
              (item) => item.token === value
            )?.title ?? ''
          )
        })
      }
    }

    return renderProps
  }

  return <RenderField {...getRenderProps()} />
}
