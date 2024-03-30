import {
  GuillotinaSharing,
  GuillotinaSharingInheritItem,
  GuillotinaSharingMap,
} from '../types/guillotina'

const base: GuillotinaSharing = {
  local: {
    roleperm: {},
    prinperm: {},
    prinrole: {},
  },
  inherit: [],
}

export class Sharing {
  local: GuillotinaSharingMap
  inherit: GuillotinaSharingInheritItem[]

  constructor(element: GuillotinaSharing | undefined) {
    if (element === undefined) {
      throw new Error('Sharing element is undefined')
    }
    this.local = element.local || base.local
    this.inherit = element.inherit || base.inherit
  }
  get roles() {
    return Object.keys(this.local.roleperm)
  }

  getRole(role: string) {
    return this.local.roleperm[role]
  }

  get principals() {
    return Object.keys(this.local.prinperm)
  }

  getPrincipals(principal: string) {
    return this.local.prinperm[principal]
  }

  get prinrole() {
    return Object.keys(this.local.prinrole)
  }

  getPrinroles(role: string) {
    return this.local.prinrole[role]
  }
}
