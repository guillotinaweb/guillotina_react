import { Checkbox } from './checkbox'

interface MultipleChoiceOption {
  text: string
  value: string
}

interface Props {
  options: MultipleChoiceOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
  dataTest?: string
}

export function MultipleChoice({
  options,
  value = [],
  onChange,
  disabled,
  dataTest,
}: Props) {
  const selected = value || []

  const toggleValue = (optionValue: string, checked: boolean) => {
    if (!onChange) return

    if (checked) {
      onChange(
        selected.includes(optionValue) ? selected : selected.concat(optionValue)
      )
      return
    }

    onChange(selected.filter((item) => item !== optionValue))
  }

  return (
    <div className="multiple-choice" data-test={dataTest}>
      {options.map((option) => {
        const isChecked = selected.includes(option.value)

        return (
          <div
            key={option.value}
            className={`multiple-choice-option ${
              isChecked ? 'is-selected' : ''
            }`}
          >
            <Checkbox
              checked={isChecked}
              disabled={disabled}
              onChange={(checked) => toggleValue(option.value, checked)}
              dataTest={`${dataTest}-${option.value}`}
            >
              {option.text}
            </Checkbox>
          </div>
        )
      })}
    </div>
  )
}

export default MultipleChoice
