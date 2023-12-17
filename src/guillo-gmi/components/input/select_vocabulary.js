import React from 'react'
import PropTypes from 'prop-types'
import { Select } from './select'
import { get } from '../../lib/utils'
import { useVocabulary } from '../../hooks/useVocabulary'

export const SelectVocabulary = React.forwardRef(
  (
    { vocabularyName, className, classWrap, val, dataTest, multiple, ...rest },
    ref
  ) => {
    const vocabulary = useVocabulary(vocabularyName)

    const getOptions = () => {
      if (get(vocabulary, 'data.items', null)) {
        const vocData = vocabulary.data.items.map((item) => {
          return {
            text: item.title.default ?? item.title,
            value: item.token,
          }
        })
        return vocData
      }

      return []
    }

    const getProps = () => {
      if (multiple) {
        const currentValue = val || []
        return {
          multiple: true,
          size: 5,
          value: currentValue,
          options: getOptions(),
        }
      }

      return {
        value: val ?? '',
        appendDefault: true,
        options: getOptions(),
      }
    }

    if (vocabulary.data === undefined || vocabulary.loading) {
      return <div />
    }

    return (
      <Select
        {...getProps()}
        className={className}
        classWrap={classWrap || 'is-fullwidth'}
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
  multiple: PropTypes.bool,
  className: PropTypes.string,
  vocabularyName: PropTypes.string,
}
