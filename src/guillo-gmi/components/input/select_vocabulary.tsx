import { Select } from './select'
import { MultipleChoice } from './multiple_choice'
import { get } from '../../lib/utils'
import { useVocabulary } from '../../hooks/useVocabulary'
import { forwardRef } from 'react'
import { GuillotinaVocabularyItem } from '../../types/guillotina'

interface Props {
  vocabularyName: string
  className?: string
  classWrap?: string
  val?: string | string[]
  dataTest?: string
  multiple?: boolean
  onChange?: (value: string | string[]) => void
  appendDefault?: boolean
  id?: string
  placeholder?: string
  disabled?: boolean
}
export const SelectVocabulary = forwardRef<HTMLSelectElement, Props>(
  (
    {
      vocabularyName,
      className,
      classWrap,
      val,
      dataTest,
      multiple,
      onChange,
      id,
      placeholder,
      disabled,
    },
    ref
  ) => {
    const vocabulary = useVocabulary(vocabularyName)

    const getOptions = () => {
      if (
        get<GuillotinaVocabularyItem | null>(vocabulary, 'data.items', null)
      ) {
        const vocData = (vocabulary?.data?.items ?? []).map((item) => {
          return {
            text: item.title,
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

    if (multiple) {
      return (
        <MultipleChoice
          value={(val || []) as string[]}
          options={getOptions()}
          dataTest={dataTest}
          onChange={(value) => onChange?.(value)}
          disabled={disabled}
        />
      )
    }

    return (
      <Select
        {...getProps()}
        className={className}
        classWrap={classWrap || 'is-fullwidth'}
        dataTest={dataTest}
        ref={ref}
        onChange={onChange}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
      />
    )
  }
)

SelectVocabulary.displayName = 'SelectVocabulary'
