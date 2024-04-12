import { Traversal, useTraversal } from '../../contexts'
import { useIntl, defineMessages } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import { Fragment, useEffect, useState } from 'react'
import { AddonAvailable, Addons } from '../../types/guillotina'

const messages = defineMessages({
  available_addons: {
    id: 'available_addons',
    defaultMessage: 'Available Addons',
  },
  no_available_addons_container: {
    id: 'no_available_addons_container',
    defaultMessage: 'No Addon available in this container',
  },
  installed_addons: {
    id: 'installed_addons',
    defaultMessage: 'Installed Addons',
  },
})

// TODO: Refactor without useAsync... just crudContext
export function PanelAddons() {
  const intl = useIntl()
  const Ctx = useTraversal()
  const [action, setAction] = useState(false)
  const [state, setState] = useState<{
    data?: {
      available: AddonAvailable[]
      installed: AddonAvailable[]
    }
    loading: boolean
    error?: Error
  }>({
    data: undefined,
    loading: false,
    error: undefined,
  })

  useEffect(() => {
    const getAddons = async () => {
      if (!state.loading && !state.data && !state.error) {
        try {
          const response = await Ctx.client.getAddons(Ctx.pathPrefix)
          const data: Addons = await response.json()
          setState({ ...state, loading: false, data: prepareData(data) })
        } catch (err) {
          setState({ ...state, loading: false, error: err as Error })
        }
      }
    }
    getAddons()
  }, [action])

  const installAddon = async (Ctx: Traversal, key: string) => {
    await Ctx.client.installAddon(Ctx.pathPrefix, key)
    Ctx.flash(`Addon ${key} installed`, 'success')
    setAction(!action)
  }

  const removeAddon = async (Ctx: Traversal, key: string) => {
    await Ctx.client.removeAddon(Ctx.pathPrefix, key)
    Ctx.flash(`Addon ${key} removed`, 'success')
    setAction(!action)
  }

  return (
    <Fragment>
      {state.loading ? (
        <div>{intl.formatMessage(genericMessages.loading)}</div>
      ) : state.error ? (
        <p>Error: {state.error.message}</p>
      ) : (
        <div className="columns">
          <div className="column">
            <h2 className="title is-size-4 has-text-grey-dark">
              {intl.formatMessage(messages.available_addons)}
            </h2>
            <hr />
            {(state.data?.available ?? []).length === 0 && (
              <p>
                {intl.formatMessage(messages.no_available_addons_container)}
              </p>
            )}
            <table className="table is-12">
              <tbody>
                {(state.data?.available ?? []).map((addon) => (
                  <tr key={addon.id}>
                    <td>{addon.title}</td>
                    <td>
                      <button
                        className="button is-primary is-small"
                        onClick={() => installAddon(Ctx, addon.id)}
                      >
                        {intl.formatMessage(genericMessages.install)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="column">
            <h2 className="title is-size-4 has-text-grey-dark">
              {intl.formatMessage(messages.installed_addons)}
            </h2>
            <hr />
            {(state.data?.installed ?? []).length === 0 && (
              <p>
                {intl.formatMessage(messages.no_available_addons_container)}
              </p>
            )}
            <table className="table is-12">
              <tbody>
                {(state.data?.installed ?? []).map((addon) => (
                  <tr key={addon.id}>
                    <td>{addon.title}</td>
                    <td>
                      <button
                        className="button is-danger is-small"
                        onClick={() => removeAddon(Ctx, addon.id)}
                      >
                        {intl.formatMessage(genericMessages.remove)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Fragment>
  )
}

const prepareData = (result: Addons) => {
  const addons = arrayToObject(result.available)
  return {
    available: result.available.filter(
      (item) => !result.installed.includes(item.id)
    ),
    installed: result.installed.map((id) => addons[id]),
  }
}

const arrayToObject = (
  array: AddonAvailable[]
): {
  [key: string]: AddonAvailable
} =>
  array.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    }
  }, {})
