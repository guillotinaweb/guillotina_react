import React from "react";

export const Textarea = ({ value = "", rows = 5, className, onChange, ...rest }) => {

  const css = "textarea " + className

  const onUpdate = (ev) => {
    if (onChange) {
      onChange(ev.target.value)
    }
  }

  return (
    <div className="field">
      <textarea className={css} rows={rows} onChange={onUpdate} {...rest}>
        {value}
      </textarea>
    </div>
  );
};
