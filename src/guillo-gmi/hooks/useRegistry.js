
import { getForm } from "../lib/registry";
import { getComponent } from "../lib/registry";
import { getAction } from "../lib/registry";


export function useRegistry() {
  return {
    getForm,
    getComponent,
    getAction
  }
}
