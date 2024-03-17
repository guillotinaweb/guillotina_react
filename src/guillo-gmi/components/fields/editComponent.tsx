import { Textarea } from '../input/textarea'
import { Checkbox } from '../input/checkbox'
import { FileUpload } from '../input/upload'
import { Select } from '../input/select'
import { Input } from '../input/input'
import { InputList } from '../input/input_list'
import { get } from '../../lib/utils'
import { SelectVocabulary } from '../input/select_vocabulary'
import { SearchInputList } from '../input/search_input_list'
import { SearchInput } from '../input/search_input'
import { useTraversal } from '../../contexts'
import { Ref, forwardRef } from 'react'
import { GuillotinaFile, GuillotinaItemsProperty } from '../../types/guillotina'
import {
  EditableFieldValue,
  IndexSignature,
  LightFile,
} from '../../types/global'

interface Props {
  schema: GuillotinaItemsProperty
  val: EditableFieldValue
  setValue: (value: EditableFieldValue) => void
  dataTest?: string
  className?: string
  placeholder?: string
  id?: string
  required?: boolean
}

export const EditComponent = forwardRef(
  (
    {
      schema,
      val,
      setValue,
      dataTest,
      className,
      placeholder,
      id,
      required,
    }: Props,
    ref
  ) => {
    const traversal = useTraversal()

    if (schema?.widget === 'search_list') {
      return (
        <>
          {placeholder && <label className="label">{placeholder}</label>}
          <SearchInputList
            value={(val || []) as string[]}
            traversal={traversal}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery}
          />
        </>
      )
    } else if (schema?.widget === 'search') {
      return (
        <>
          {placeholder && <label className="label">{placeholder}</label>}
          <SearchInput
            value={val as string}
            traversal={traversal}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery}
          />
        </>
      )
    } else if (schema?.widget === 'textarea' || schema?.widget === 'richtext') {
      return (
        <Textarea
          value={(val || '') as string}
          className={className}
          onChange={(ev) => setValue(ev)}
          ref={ref as Ref<HTMLTextAreaElement>}
          dataTest={dataTest}
          placeholder={placeholder}
          id={id}
        />
      )
    } else if (schema?.type === 'boolean') {
      return (
        <Checkbox
          checked={Boolean(val)}
          className={className}
          onChange={(ev) => setValue(ev)}
          dataTest={dataTest}
        />
      )
    } else if (schema?.type === 'array') {
      if (schema.items && schema.items.type === 'string') {
        if (schema.items.vocabularyName) {
          return (
            <SelectVocabulary
              vocabularyName={get(schema, 'items.vocabularyName', '')}
              val={(val || []) as string[]}
              className={className}
              classWrap="is-fullwidth"
              dataTest={dataTest}
              onChange={setValue}
              multiple
              placeholder={placeholder}
              id={id}
            />
          )
        } else if (schema?.items?.vocabulary) {
          return (
            <Select
              value={(val || []) as string[]}
              className={className}
              classWrap="is-fullwidth"
              dataTest={dataTest}
              options={schema?.items.vocabulary.map((item) => {
                return {
                  text: item,
                  value: item,
                }
              })}
              multiple
              onChange={setValue}
              placeholder={placeholder}
              id={id}
            />
          )
        }
      }
      return (
        <>
          {placeholder && <label className="label">{placeholder}</label>}
          <InputList
            value={(val || []) as string[]}
            className={className}
            onChange={(val) => setValue(val as string[])}
            ref={ref as Ref<HTMLInputElement>}
            dataTest={dataTest}
          />
        </>
      )
    } else if (schema?.widget === 'file') {
      const value = val as GuillotinaFile
      return (
        <FileUpload
          onChange={(ev) => setValue(ev as LightFile)}
          label={get(value, 'filename', undefined)}
          dataTest={dataTest}
        />
      )
    } else if (schema?.widget === 'select' && schema.type === 'string') {
      if (schema?.vocabularyName) {
        return (
          <SelectVocabulary
            val={(val || '') as string}
            className={className}
            appendDefault
            classWrap="is-fullwidth"
            dataTest={dataTest}
            onChange={setValue}
            vocabularyName={get(schema, 'vocabularyName', '')}
            placeholder={placeholder}
            id={id}
          />
        )
      }

      return (
        <Select
          value={(val || '') as string}
          className={className}
          appendDefault
          classWrap="is-fullwidth"
          dataTest={dataTest}
          options={(schema?.vocabulary ?? []).map((item) => {
            return {
              text: item,
              value: item,
            }
          })}
          onChange={setValue}
          placeholder={placeholder}
          id={id}
        />
      )
    } else if (schema?.type === 'object' && schema.widget !== 'file') {
      const value = val as IndexSignature
      return (
        <>
          {schema.title && <h4 className="subtitle mt-2">{schema.title}</h4>}
          {Object.keys(get(schema, 'properties', {})).map((key) => {
            const subSchema = get<GuillotinaItemsProperty | null>(
              schema,
              `properties.${key}`,
              null
            )
            const requiredFields: string[] = get(schema, 'required', [])
            if (!subSchema) return null
            return (
              <EditComponent
                key={`${id}[${key}]`}
                id={`${id}[${key}]`}
                schema={subSchema}
                val={value && key in value ? value[key] : ''}
                placeholder={subSchema?.title ?? ''}
                required={requiredFields.includes(key)}
                setValue={(ev) => {
                  setValue({ ...value, [key]: ev } as IndexSignature)
                }}
                dataTest={`${key}TestInput`}
              />
            )
          })}
        </>
      )
    }
    const getInputType = () => {
      switch (schema?.type) {
        case 'integer':
          return 'number'
        case 'date':
          return 'date'
        case 'datetime':
          return 'datetime-local'
        case 'time':
          return 'time'
        default:
          return 'text'
      }
    }
    return (
      <Input
        value={(val || '') as string}
        className={className}
        dataTest={dataTest}
        onChange={(ev) => setValue(ev)}
        ref={ref as Ref<HTMLInputElement>}
        type={getInputType()}
        required={required}
        placeholder={placeholder}
        id={id}
      />
    )
  }
)

EditComponent.displayName = 'EditComponent'
export default EditComponent
