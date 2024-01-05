import React from 'react'
import { useTraversal } from '../../contexts'
import useAsync from '../../hooks/useAsync'
import { useIntl, defineMessages } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'

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
export function PanelAddons(props) {
  const intl = useIntl()
  const Ctx = useTraversal()
  let [action, setAction] = React.useState(false)

  const installAddon = async (Ctx, key) => {
    await Ctx.client.installAddon(Ctx.pathPrefix, key)
    Ctx.flash(`Addon ${key} installed`, 'success')
    setAction(!action)
  }

  const removeAddon = async (Ctx, key) => {
    await Ctx.client.removeAddon(Ctx.pathPrefix, key)
    Ctx.flash(`Addon ${key} removed`, 'success')
    setAction(!action)
  }

  const state = useAsync(async () => {
    const response = await Ctx.client.getAddons(Ctx.pathPrefix)
    const data = await response.json()
    return prepareData(data)
  }, [action])

  return (
    <React.Fragment>
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
            {state.value.available.length === 0 && (
              <p>
                {intl.formatMessage(messages.no_available_addons_container)}
              </p>
            )}
            <table className="table is-12">
              <tbody>
                {state.value.available.map((addon) => (
                  <tr>
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
            {state.value.installed.length === 0 && (
              <p>
                {intl.formatMessage(messages.no_available_addons_container)}
              </p>
            )}
            <table className="table is-12">
              <tbody>
                {state.value.installed.map((addon) => (
                  <tr>
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
    </React.Fragment>
  )
}

const prepareData = (result) => {
  const addons = arrayToObject(result.available)
  return {
    available: result.available.filter(
      (item) => !result.installed.includes(item.id)
    ),
    installed: result.installed.map((id) => addons[id]),
  }
}

const arrayToObject = (array) =>
  array.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})
