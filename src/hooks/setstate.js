
import { useCallback, useState } from 'react';


export function useSetState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setState = useCallback(
    (v) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v),
      }));
    },
    [setValue],
  );
  // Disabled on purpose to avoid new references on each render.
  // Since initialValue will be object and new reference is
  // guaranteed here, while values are the same, hence we can keep using old function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetState = useCallback(() => setValue(initialValue), []);

  return [value, setState, resetState];
}

export default useSetState;
