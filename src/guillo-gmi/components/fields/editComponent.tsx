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

interface Props {
  schema: any
  val: any
  setValue: (value: any) => void
  dataTest?: string
  className?: string
  placeholder?: string
}

export const EditComponent = forwardRef(
  ({ schema, val, setValue, dataTest, className, placeholder }: Props, ref) => {
    const traversal = useTraversal()

    if (schema?.widget === 'search_list') {
      return (
        <>
          {placeholder && <label className="label">{placeholder}</label>}
          <SearchInputList
            value={val || []}
            traversal={traversal}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery ? schema.typeNameQuery : null}
          />
        </>
      )
    } else if (schema?.widget === 'search') {
      return (
        <>
          {placeholder && <label className="label">{placeholder}</label>}
          <SearchInput
            value={val}
            traversal={traversal}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery ? schema.typeNameQuery : null}
          />
        </>
      )
    } else if (schema?.widget === 'textarea' || schema?.widget === 'richtext') {
      return (
        <Textarea
          value={val || ''}
          className={className}
          onChange={(ev) => setValue(ev)}
          ref={ref as Ref<HTMLTextAreaElement>}
          dataTest={dataTest}
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
              vocabularyName={get(schema, 'items.vocabularyName', null)}
              val={val || []}
              className={className}
              classWrap="is-fullwidth"
              dataTest={dataTest}
              onChange={setValue}
              multiple
            />
          )
        } else if (schema?.items?.vocabulary) {
          return (
            <Select
              value={val || []}
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
            />
          )
        }
      }
      return (
        <InputList
          value={val || []}
          className={className}
          onChange={(ev) => setValue(ev)}
          ref={ref as Ref<HTMLInputElement>}
          dataTest={dataTest}
        />
      )
    } else if (schema?.widget === 'file') {
      return (
        <FileUpload
          onChange={(ev) => setValue(ev)}
          label={get(val, 'filename', null)}
          dataTest={dataTest}
        />
      )
    } else if (schema?.widget === 'select' && schema.type === 'string') {
      if (schema?.vocabularyName) {
        return (
          <SelectVocabulary
            val={val || ''}
            className={className}
            appendDefault
            classWrap="is-fullwidth"
            dataTest={dataTest}
            onChange={setValue}
            vocabularyName={get(schema, 'vocabularyName', null)}
          />
        )
      }

      return (
        <Select
          value={val || ''}
          className={className}
          appendDefault
          classWrap="is-fullwidth"
          dataTest={dataTest}
          options={schema?.vocabulary.map((item) => {
            return {
              text: item,
              value: item,
            }
          })}
          onChange={setValue}
        />
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
        default:
          return 'text'
      }
    }
    return (
      <Input
        value={val || ''}
        className={className}
        dataTest={dataTest}
        onChange={(ev) => setValue(ev)}
        ref={ref as Ref<HTMLInputElement>}
        type={getInputType()}
      />
    )
  }
)

EditComponent.displayName = 'EditComponent'
export default EditComponent
