import { useEffect, useState } from 'react'
import { DownloadField } from './downloadField'
import { IntlShape, useIntl } from 'react-intl'
import { useVocabulary } from '../../hooks/useVocabulary'
import { get } from '../../lib/utils'
import { buildQs } from '../../lib/search'
import { useTraversal } from '../../contexts'
import { useConfig } from '../../hooks/useConfig'
import {
  GuillotinaSchemaProperty,
  GuillotinaVocabularyItem,
  SearchItem,
} from '../../types/guillotina'
import { EditableFieldValue, IndexSignature } from '../../types/global'

const plain = ['string', 'number', 'boolean']
type PlainType = string | boolean | number

interface RenderFieldProps {
  value: EditableFieldValue
  Widget?: React.ComponentType<{
    value: EditableFieldValue
    schema?: GuillotinaSchemaProperty
    modifyContent?: boolean
  }>
  schema?: GuillotinaSchemaProperty
}

export function RenderField({ value, Widget, schema }: RenderFieldProps) {
  if (value === null || value === undefined) return ''

  if (Widget) {
    return <Widget value={value} schema={schema} />
  }

  const type = typeof value
  if (plain.includes(type)) {
    return value as PlainType
  }
  if (type === 'object') {
    if (Array.isArray(value)) {
      return value.map((item: EditableFieldValue, index) => (
        <div key={`renderField_${index}_${schema?.title}`}>
          <RenderField value={item} />
        </div>
      ))
    }
    if (schema?.properties?.key !== undefined) {
      return Object.keys(value).map((key) => (
        <FieldValue
          field={get(schema, `properties.${key}.title`, key)}
          schema={schema.properties!.key as GuillotinaSchemaProperty}
          value={get(value as IndexSignature, key, {})}
          key={key}
        />
      ))
    }
  }
  return <p>No render for {JSON.stringify(value)}</p>
}

interface FieldValueProps {
  field: string
  value: EditableFieldValue
  schema: GuillotinaSchemaProperty
}
const FieldValue = ({ field, value, schema }: FieldValueProps) => (
  <div className="field">
    <div className="label">{field}</div>
    <div className="value">
      <RenderFieldComponent val={value} schema={schema} field={field} />
    </div>
  </div>
)

const DEFAULT_VALUE_NO_EDITABLE_FIELD = ' -- '
const getDefaultValueEditableField = (intl: IntlShape) => {
  return intl.formatMessage({
    id: 'default_value_editable_field',
    defaultMessage: 'Click to edit',
  })
}

interface SearchRenderFieldProps {
  schema: GuillotinaSchemaProperty
  value: string | string[]
  modifyContent: boolean
}
export const SearchRenderField = ({
  schema,
  value,
  modifyContent,
}: SearchRenderFieldProps) => {
  const intl = useIntl()
  const [valuesLabels, setValuesLabels] = useState<string[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const traversal = useTraversal()
  const { SearchEngine } = useConfig()
  const DEFAULT_VALUE_EDITABLE_FIELD = getDefaultValueEditableField(intl)

  useEffect(() => {
    const fetchData = async (valuesToSearch: string[]) => {
      setIsLoadingData(true)
      let searchTermQs = ''

      const searchTermParsed = ['__or', `id=${valuesToSearch.join('%26id=')}`]
      const { get: getSearch } = traversal.registry
      const fnName: string = getSearch(
        'searchEngineQueryParamsFunction',
        SearchEngine
      )
      const qsParsed = traversal.client.getQueryParamsSearchFunction(fnName)({
        path: traversal.path,
        start: 0,
        pageSize: 100,
        withDepth: false,
      })

      if (searchTermParsed.length > 0 || qsParsed.length > 0) {
        searchTermQs = buildQs([searchTermParsed, ...qsParsed])
      }
      const data = await traversal.client.search<SearchItem>(
        traversal.client.getContainerFromPath(traversal.path),
        searchTermQs,
        false,
        false
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

interface VocabularyRenderFieldProps {
  schema: GuillotinaSchemaProperty
  value: string | string[]
  modifyContent: boolean
}
export const VocabularyRenderField = ({
  schema,
  value,
  modifyContent,
}: VocabularyRenderFieldProps) => {
  const intl = useIntl()
  const DEFAULT_VALUE_EDITABLE_FIELD = getDefaultValueEditableField(intl)

  const vocabularyName =
    schema?.items?.vocabularyName || schema?.vocabularyName || ''
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
      const vocabularyValue = get<GuillotinaVocabularyItem[]>(
        vocabulary,
        'data.items',
        []
      ).find((item) => item.token === value)
      renderProps['value'] = vocabularyValue?.title ?? ''
    } else {
      renderProps['value'] = ((renderProps['value'] as string[]) ?? []).map(
        (value: string) => {
          return (
            get<GuillotinaVocabularyItem[]>(vocabulary, 'data.items', []).find(
              (item) => item.token === value
            )?.title ?? ''
          )
        }
      )
    }

    return renderProps
  }
  return <RenderField {...getRenderProps()} />
}

interface RenderFieldComponentProps {
  schema: GuillotinaSchemaProperty
  field: string
  val: EditableFieldValue
  modifyContent?: boolean
}
export function RenderFieldComponent({
  schema,
  field,
  val,
  modifyContent,
}: RenderFieldComponentProps) {
  const intl = useIntl()
  const DEFAULT_VALUE_EDITABLE_FIELD = getDefaultValueEditableField(intl)

  const getRenderProps = () => {
    const renderProps: {
      value: EditableFieldValue
      schema: GuillotinaSchemaProperty
      Widget?: React.ComponentType<any>
    } = {
      value:
        val ??
        (modifyContent
          ? DEFAULT_VALUE_EDITABLE_FIELD
          : DEFAULT_VALUE_NO_EDITABLE_FIELD),
      schema: schema,
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
      renderProps['value'] = new Date(val as string).toLocaleString()
    } else if (schema?.items?.vocabularyName || schema?.vocabularyName) {
      renderProps['Widget'] = VocabularyRenderField
    } else if (
      schema?.widget === 'search' ||
      schema?.widget === 'search_list'
    ) {
      renderProps['Widget'] = SearchRenderField
      renderProps['value'] = val as string | string[]
    }
    return renderProps
  }

  return <RenderField {...getRenderProps()} />
}
