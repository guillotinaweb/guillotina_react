import React, { useEffect, useState } from 'react'
import { DownloadField } from './downloadField'
import { useIntl } from 'react-intl'
import { useVocabulary } from '../../hooks/useVocabulary'
import { get } from '../../lib/utils'
import { buildQs } from '../../lib/search'
import { useTraversal } from '../../contexts'
import { useConfig } from '../../hooks/useConfig'

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

export const SearchRenderField = ({ schema, value, modifyContent }) => {
  const [valuesLabels, setValuesLabels] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const traversal = useTraversal()
  const { SearchEngine } = useConfig()

  useEffect(() => {
    const fetchData = async (valuesToSearch) => {
      setIsLoadingData(true)
      let searchTermQs = []

      const searchTermParsed = ['__or', `id=${valuesToSearch.join('%26id=')}`]
      const { get: getSearch } = traversal.registry
      const fnName = getSearch('searchEngineQueryParamsFunction', SearchEngine)
      const qsParsed = traversal.client[fnName]({
        path: traversal.path,
        start: 0,
        pageSize: 100,
        withDepth: false,
      })

      if (searchTermParsed.length > 0 || qsParsed.length > 0) {
        searchTermQs = buildQs([searchTermParsed, ...qsParsed])
      }
      const data = await traversal.client.search(
        traversal.client.getContainerFromPath(traversal.path),
        searchTermQs,
        false,
        false,
        0,
        100
      )

      const newValuesLabel = data.items.map((item) => {
        return get(item, schema?.labelProperty ?? 'title', item.id)
      })
      setValuesLabels(newValuesLabel)
      setIsLoadingData(false)
    }

    let valuesToSearch = value
    if (typeof valuesToSearch === 'string') {
      valuesToSearch = [valuesToSearch]
    }

    if (valuesToSearch !== undefined && valuesToSearch.length > 0) {
      fetchData(valuesToSearch)
    } else {
      setValuesLabels([])
    }
  }, [value])

  const getRenderValue = () => {
    if (value === undefined) {
      if (modifyContent) {
        return DEFAULT_VALUE_EDITABLE_FIELD
      }
      return DEFAULT_VALUE_NO_EDITABLE_FIELD
    }
    if (isLoadingData) {
      return 'Loading...'
    }

    return valuesLabels
  }

  return <RenderField value={getRenderValue()} />
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
    } else if (
      schema?.widget === 'search' ||
      schema?.widget === 'search_list'
    ) {
      renderProps['Widget'] = SearchRenderField
      renderProps['value'] = val
      renderProps['schema'] = schema
    }
    return renderProps
  }

  return <RenderField {...getRenderProps()} />
}
