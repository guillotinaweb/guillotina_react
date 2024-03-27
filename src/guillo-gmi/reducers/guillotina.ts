import { ItemModel } from '../models'
import { IndexSignature } from '../types/global'
import { GuillotinaCommonObject } from '../types/guillotina'

export interface GuillotinaGlobalState {
  path: string
  loading: boolean
  context: GuillotinaCommonObject
  flash: {
    message?: string
    type?: string
  }
  action: {
    action?: string
    params?: IndexSignature
  }
  permissions: IndexSignature
  errorStatus?: string
  registry: IndexSignature
  refresh?: number
}

export const initialState: Partial<GuillotinaGlobalState> = {
  path: '',
  loading: false,
  context: undefined,
  flash: {
    message: undefined,
    type: undefined,
  },
  action: {
    action: undefined,
    params: undefined,
  },
  permissions: [],
  errorStatus: undefined,
  registry: {},
  refresh: undefined,
}

export enum GuillotinaReducerActionTypes {
  SET_PATH = 'SET_PATH',
  SET_CONTEXT = 'SET_CONTEXT',
  SET_ERROR = 'SET_ERROR',
  SET_FLASH = 'SET_FLASH',
  CLEAR_FLASH = 'CLEAR_FLASH',
  SET_ACTION = 'SET_ACTION',
  CLEAR_ACTION = 'CLEAR_ACTION',
  REFRESH = 'REFRESH',
  APPLY = 'APPLY',
}
export function guillotinaReducer(
  state: GuillotinaGlobalState,
  action: { type: GuillotinaReducerActionTypes; payload: IndexSignature }
): GuillotinaGlobalState {
  switch (action.type) {
    case GuillotinaReducerActionTypes.SET_PATH:
      return { ...state, path: action.payload.path, loading: true }

    case GuillotinaReducerActionTypes.SET_CONTEXT:
      return {
        ...state,
        ...action.payload,
        errorStatus: undefined,
        loading: false,
      }

    case GuillotinaReducerActionTypes.SET_ERROR:
      return {
        ...state,
        errorStatus: action.payload.errorStatus,
        loading: false,
      }

    case GuillotinaReducerActionTypes.SET_FLASH:
      return { ...state, ...action.payload }

    case GuillotinaReducerActionTypes.CLEAR_FLASH:
      return {
        ...state,
        flash: {
          message: undefined,
          type: undefined,
        },
      }
    case GuillotinaReducerActionTypes.SET_ACTION:
      return { ...state, action: action.payload }
    case GuillotinaReducerActionTypes.CLEAR_ACTION:
      return { ...state, action: { action: undefined, params: undefined } }

    case GuillotinaReducerActionTypes.REFRESH:
      return {
        ...state,
        refresh: Date.now(),
        loading: !action.payload.transparent,
      }

    case GuillotinaReducerActionTypes.APPLY:
      return {
        ...state,
        context: { ...state.context, ...action.payload.context },
      }

    default:
      return state
  }
}

export interface IColumn {
  key: string
  label: string
  isSortable: string
  child: (
    model: ItemModel,
    link: () => void,
    search: string
  ) => React.ReactElement
}
