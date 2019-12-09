import React from 'react'
import Form from 'react-jsonschema-form'




const schema = {
  type: "object",
  required: ["name"],
  properties: {
    name: {type: "string", title: "Name"},
    id: {type: "string", title: "Id"}
  }
};


const MyCustomWidget = (props) => {
  return (
    <input type="text"
      className="input"
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  );
};

export const widgets = {
  BaseInput: MyCustomWidget
};


export function Tpl(props) {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    rawErrors=[],
    children
  } = props;
  return (
    <div className={'field ' + classNames}>
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
      {description}
      <div className="control">
      {children}
      </div>
      <p className="help is-danger">
        {rawErrors.map(error => error)}
      </p>
      <p className="help">{help}</p>
    </div>
  );
}


export function BaseForm({onSubmit, onError, actionName, title}) {

  return (
    <>
      <h3
        className="title is-size-4 has-text-info">{title}</h3>
      <Form schema={schema}
          onSubmit={onSubmit}
          onError={onError}
          FieldTemplate={Tpl}
          widgets={widgets}
      >
        <div className="level level-right">
        <button type="submit"
          className="button is-success">
          {actionName || 'Add'}
        </button>
        </div>
      </Form>
    </>
  )

}
