

import {ApplicationCtx} from '../views/application'
import {DatabaseCtx} from '../views/application'
import {ContainerCtx} from '../views/container'


let registry = {
  'Application': ApplicationCtx,
  'Database': DatabaseCtx,
  'Container': ContainerCtx,
}

export const getComponent = (context) => {
  if (!context) return
  return registry[context["@type"]]
}

export const registerComponent = (context, Component) => {
  registry[context] = Component
}
