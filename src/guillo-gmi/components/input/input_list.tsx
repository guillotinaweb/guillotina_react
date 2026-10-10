import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Input } from './input'
import { useIntl } from 'react-intl'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  dataTest?: string
  id?: string
  disabled?: boolean
}
export const InputList = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & Props
>(({ value, onChange, dataTest, id, disabled }, ref) => {
  const intl = useIntl()
  const [inputValue, setInputValue] = useState('')

  const addValue = () => {
    const nextValue = inputValue.trim()
    if (nextValue === '') return

    onChange([...(value ?? []), nextValue])
    setInputValue('')
  }

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addValue()
    }
  }

  return (
    <div className="input-list">
      {(value ?? []).length > 0 && (
        <div className="tags input-list-values">
          {value.map((tag, index) => (
            <div
              key={`input_list_${tag}_${index}`}
              className="tag is-info is-medium"
            >
              {tag}
              <button
                className="delete is-small"
                type="button"
                disabled={disabled}
                aria-label={intl.formatMessage(
                  {
                    id: 'remove_list_value',
                    defaultMessage: 'Remove {value}',
                  },
                  { value: tag }
                )}
                onClick={() =>
                  onChange([
                    ...value.filter((tag) => value.indexOf(tag) !== index),
                  ])
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className="field has-addons input-list-add">
        <div className="control is-expanded">
          <Input
            type="text"
            id={id}
            placeholder={intl.formatMessage({
              id: 'list_value_placeholder',
              defaultMessage: 'Value',
            })}
            onKeyDown={(event) => addTags(event)}
            value={inputValue}
            ref={ref}
            dataTest={dataTest}
            disabled={disabled}
            onChange={(value) => {
              setInputValue(value)
            }}
          />
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-light"
            disabled={disabled || inputValue.trim() === ''}
            onClick={addValue}
          >
            <span className="icon is-small">
              <i className="fas fa-plus"></i>
            </span>
            <span>
              {intl.formatMessage({
                id: 'add_list_value',
                defaultMessage: 'Add',
              })}
            </span>
          </button>
        </div>
      </div>
      <p className="help input-list-help">
        {intl.formatMessage({
          id: 'input_list_help',
          defaultMessage: 'Add one value at a time.',
        })}
      </p>
    </div>
  )
})

InputList.displayName = 'InputList'
export default InputList
