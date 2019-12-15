import React from "react";

const applyValidators = (value, validators) => {
  let validation = Array.isArray(validators) ? validators : [validators];
  let result = true;
  validation.forEach(func => {
    if (func(value) === false) {
      result = false;
    }
  });
  return result;
};

const useInput = (onChange, value, validator) => {
  let [state, setState] = React.useState({ hasError: false, value: value });

  const onUpdate = ev => {
    const value = ev.target.value;
    setState({ value, hasError: false });
    onChange(value);
  };

  const onBlur = ev => {
    const hasError = applyValidators(state.value, validator) === false;
    if (hasError) setState({ value: state.value, hasError });
  };

  const onFocus = ev => {
    if (state.hasError) {
      setState({ value: state.value, hasError: false });
    }
  };

  return {
    onChange: onUpdate,
    onFocus,
    onBlur,
    state
  };
};

export default useInput;
