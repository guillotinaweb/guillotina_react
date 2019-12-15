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


const BaseWidget = (props) => {
  return (
    <input type={props.type}
      className="input"
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  );
};

const TextWidget = (props) => <BaseWidget type="text" {...props} />
const PasswordWidget = (props) => <BaseWidget type="password" {...props} />
const CheckboxWidget = (props) => <BaseWidget type="checkbox" {...props} />

export const widgets = {
  TextWidget,
  PasswordWidget,
  CheckboxWidget
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

// const itemSchema = {
//   type: "object",
//   required: ["name"],
//   properties: {
// }


// export function ItemForm({onSubmit, onError, actionName, title, formData}) {
//   return (
//     <>
//       <h3
//         className="title is-size-4 has-text-info">{title}</h3>
//       <Form schema={schema}
//           onSubmit={onSubmit}
//           onError={onError}
//           FieldTemplate={Tpl}
//           widgets={widgets}
//       >
//         <div className="level level-right">
//         <button type="submit"
//           className="button is-success">
//           {actionName || 'Add'}
//         </button>
//         </div>
//       </Form>
//     </>
//   )

// }
