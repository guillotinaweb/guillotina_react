

const base = {
  local: {
    roleperm: {},
    prinperm: {},
    prinrole: {}
  },
  inherit: {}
}

export class Sharing {
  constructor(element) {
    Object.assign(this, element || base)
  }

  get roles() {
    return Object.keys(this.local.roleperm)
  }

  getRole(role) {
    return this.local.roleperm[role]
  }

  get principals() {
    return Object.keys(this.local.prinperm)
  }

  getPrincipals(principal) {
    return this.local.prinperm[principal]
  }

  get prinrole() {
    return Object.keys(this.local.prinrole)
  }

  getPrinroles(role) {
    return this.local.prinrole[role]
  }

}

