import React from 'react'

export const Textarea = React.forwardRef(
  ({ value = '', rows = 5, className, onChange,dataTest, ...rest }, ref) => {
    const css = 'textarea ' + className

    const onUpdate = (ev) => {
      if (onChange) {
        onChange(ev.target.value)
      }
    }

    return (
      <div className="field">
        <textarea
          className={css}
          rows={rows}
          onChange={onUpdate}
          value={value}
          data-test={dataTest}
          {...rest}
          ref={ref}
        />
      </div>
    )
  }
)
