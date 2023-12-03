import React from 'react'
import PropTypes from 'prop-types'
import { Select } from './select'
import { get } from '../../lib/utils'
import { useVocabularyDynamicBySchema } from '../../hooks/useVocabulary/useVocabularyDynamicBySchema'

export const SelectVocabulary = React.forwardRef(
  ({ schema, className, setValue, val, dataTest, ...rest }, ref) => {
    const vocabulary = useVocabularyDynamicBySchema(schema)

    const getOptions = (items) => {
      if (get(vocabulary, 'data.items', null)) {
        const vocData = vocabulary.data.items.map((item) => {
          return {
            text: item.title.default ?? item.title,
            value: item.token,
          }
        })
        return vocData
      }

      return items.map((item) => {
        return {
          text: item,
          value: item,
        }
      })
    }

    const getProps = () => {
      if (schema.type === 'array') {
        const currentValue = val || []
        return {
          multiple: true,
          size: 5,
          value: currentValue,
          options: getOptions(schema.items.enum),
          onChange: (ev) => {
            const selectValue = get(ev, 'target.value', '')
            if (!currentValue.includes(selectValue)) {
              setValue([...currentValue, selectValue])
            } else {
              setValue(currentValue.filter((value) => value !== selectValue))
            }
          },
        }
      }

      return {
        value: val ?? '',
        appendDefault: true,
        options: getOptions(schema.enum),
        onChange: (ev) => {
          let selectValue = get(ev, 'target.value', '')
          if (selectValue === '') {
            selectValue = null
          }
          return setValue(selectValue)
        },
      }
    }

    if (vocabulary.data === undefined || vocabulary.loading) {
      return <div />
    }

    return (
      <Select
        {...getProps()}
        className={className}
        classWrap="is-fullwidth"
        dataTest={dataTest}
        ref={ref}
        {...rest}
      />
    )
  }
)

Select.propTypes = {
  error: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  size: PropTypes.number,
  onChange: PropTypes.func,
  schema: PropTypes.object,
  multiple: PropTypes.bool,
  className: PropTypes.string,
}
