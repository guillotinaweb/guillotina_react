import React from 'react'
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

export const EditComponent = React.forwardRef(
  ({ schema, val, setValue, dataTest, className, ...rest }, ref) => {
    const traversal = useTraversal()

    if (schema?.widget === 'search_list') {
      return (
        <React.Fragment>
          {rest.placeholder && (
            <label className="label">{rest.placeholder}</label>
          )}
          <SearchInputList
            value={val || []}
            traversal={traversal}
            className={className}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            dataTest={dataTest}
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery ? schema.typeNameQuery : null}
            {...rest}
          />
        </React.Fragment>
      )
    } else if (schema?.widget === 'search') {
      return (
        <React.Fragment>
          {rest.placeholder && (
            <label className="label">{rest.placeholder}</label>
          )}
          <SearchInput
            value={val}
            traversal={traversal}
            className={className}
            onChange={(ev) => setValue(ev)}
            queryCondition={
              schema?.queryCondition ? schema.queryCondition : 'title__in'
            }
            dataTest={dataTest}
            path={schema.queryPath}
            labelProperty={
              schema?.labelProperty ? schema.labelProperty : 'title'
            }
            typeNameQuery={schema?.typeNameQuery ? schema.typeNameQuery : null}
            {...rest}
          />
        </React.Fragment>
      )
    } else if (schema?.widget === 'textarea' || schema?.widget === 'richtext') {
      return (
        <Textarea
          value={val || ''}
          className={className}
          onChange={(ev) => setValue(ev)}
          ref={ref}
          dataTest={dataTest}
          {...rest}
        />
      )
    } else if (schema?.type === 'boolean') {
      return (
        <Checkbox
          value={!!val}
          className={className}
          onChange={(ev) => setValue(ev)}
          ref={ref}
          dataTest={dataTest}
          {...rest}
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
              {...rest}
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
              {...rest}
            />
          )
        }
      }
      return (
        <React.Fragment>
          {rest.placeholder && (
            <label className="label">{rest.placeholder}</label>
          )}
          <InputList
            value={val || []}
            className={className}
            onChange={(ev) => setValue(ev)}
            ref={ref}
            dataTest={dataTest}
            {...rest}
          />
        </React.Fragment>
      )
    } else if (schema?.widget === 'file') {
      return (
        <FileUpload
          onChange={(ev) => setValue(ev)}
          label={get(val, 'filename', null)}
          dataTest={dataTest}
          {...rest}
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
            {...rest}
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
          {...rest}
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
        ref={ref}
        type={getInputType()}
        {...rest}
      />
    )
  }
)

EditComponent.displayName = 'EditComponent'
export default EditComponent
