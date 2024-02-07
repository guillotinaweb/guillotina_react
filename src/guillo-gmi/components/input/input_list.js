import * as React from 'react'
import { Input } from './input'
import { useIntl } from 'react-intl'

export const InputList = React.forwardRef(
  ({ value, onChange, dataTest }, ref) => {
    const intl = useIntl()
    const [inputValue, setInputValue] = React.useState('')
    const addTags = (event) => {
      if (event.key === 'Enter' && event.target.value !== '') {
        onChange([...value, event.target.value])
        setInputValue('')
      }
    }

    return (
      <div className="control">
        {(value ?? []).length > 0 && (
          <div className="tags">
            {value.map((tag, index) => (
              <div
                key={`input_list_${tag}_${index}`}
                className="tag is-info is-medium"
              >
                {tag}
                <button
                  className="delete is-small"
                  onClick={() =>
                    onChange([
                      ...value.filter((tag) => value.indexOf(tag) !== index),
                    ])
                  }
                ></button>
              </div>
            ))}
          </div>
        )}
        <Input
          type="text"
          placeholder={intl.formatMessage({
            id: 'press_enter_to_add_value',
            defaultMessage: 'Press enter to add value',
          })}
          onKeyUp={(event) => addTags(event)}
          value={inputValue}
          ref={ref}
          dataTest={dataTest}
          onChange={(value) => {
            if (value !== '') {
              setInputValue(value)
            }
          }}
        />
      </div>
    )
  }
)
