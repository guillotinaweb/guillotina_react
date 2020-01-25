
export const initialState = {
  path: "",
  loading: false,
  context: undefined,
  flash: {
    message: undefined,
    type: undefined
  },
  action: {
    action: undefined,
    params: undefined
  },
  permissions: undefined,
  errorStatus: undefined,
  registry: {},
  refresh: undefined
};


export function guillotinaReducer(state, action) {
  switch (action.type) {
    case "SET_PATH":
      return { ...state, path: action.payload, loading:true };

    case "SET_CONTEXT":
      return { ...state, ...action.payload, errorStatus:undefined, loading:false };

    case "SET_ERROR":
      return { ...state, errorStatus: action.payload, loading:false };

    case "SET_FLASH":
      return { ...state, ...action.payload };

    case "CLEAR_FLASH":
      return {
        ...state,
        flash: {
          message: undefined,
          type: undefined
        }
      };
    case "SET_ACTION":
      return { ...state, action: action.payload };
    case "CLEAR_ACTION":
      return { ...state, action: { action: undefined, params: undefined } };

    case "REFRESH":
      return {...state, refresh:Math.random(), loading:true}

    case "APPLY":
      return {...state, context: {...state.context, ...action.payload}}

    default:
      return state;
  }
}
