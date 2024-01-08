import React from 'react'
import { DownloadField } from './downloadField'
import { useIntl } from 'react-intl'
import { useVocabulary } from '../../hooks/useVocabulary'
import { get } from '../../lib/utils'

const plain = ['string', 'number', 'boolean']

export function RenderField({ value, Widget, schema }) {
  if (value === null || value === undefined) return ''

  if (Widget) {
    return <Widget value={value} schema={schema} />
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

const DEFAULT_VALUE_NO_EDITABLE_FIELD = ' -- '
const getDefaultValueEditableField = (intl) => {
  return intl.formatMessage({
    id: 'default_value_editable_field',
    defaultMessage: 'Click to edit',
  })
}

export const VocabularyRenderField = ({ schema, value, modifyContent }) => {
  const intl = useIntl()
  const DEFAULT_VALUE_EDITABLE_FIELD = getDefaultValueEditableField(intl)

  const vocabularyName = schema?.items?.vocabularyName || schema?.vocabularyName
  const vocabulary = useVocabulary(vocabularyName)

  const getRenderProps = () => {
    const renderProps = {
      value:
        value ??
        (modifyContent
          ? DEFAULT_VALUE_EDITABLE_FIELD
          : DEFAULT_VALUE_NO_EDITABLE_FIELD),
    }

    if (schema?.vocabularyName) {
      const vocabularyValue = get(vocabulary, 'data.items', []).find(
        (item) => item.token === value
      )
      renderProps['value'] = vocabularyValue?.title ?? ''
    } else {
      renderProps['value'] = (renderProps['value'] ?? []).map((value) => {
        return (
          get(vocabulary, 'data.items', []).find((item) => item.token === value)
            ?.title ?? ''
        )
      })
    }

    return renderProps
  }
  return <RenderField {...getRenderProps()} />
}

export function RenderFieldComponent({ schema, field, val, modifyContent }) {
  const intl = useIntl()
  const DEFAULT_VALUE_EDITABLE_FIELD = getDefaultValueEditableField(intl)

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
      renderProps['Widget'] = VocabularyRenderField
      renderProps['schema'] = schema
    }

    return renderProps
  }

  return <RenderField {...getRenderProps()} />
}
