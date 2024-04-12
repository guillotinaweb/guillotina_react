import { useCrudContext } from '../../hooks/useCrudContext'
import { Table } from '../ui/table'
import { Button } from '../input/button'
import { useIntl } from 'react-intl'
import { genericMessages } from '../../locales/generic_messages'
import { Fragment, useEffect, useState } from 'react'
import { GuillotinaBehaviors } from '../../types/guillotina'

export function PanelBehaviors() {
  const intl = useIntl()
  const {
    Ctx,
    get,
    result,
    loading,
    isError,
  } = useCrudContext<GuillotinaBehaviors>()
  const ops = useCrudContext()

  const [state, setState] = useState(false)

  const enableBehavior = (behavior: string) => async () => {
    await ops.patch({ behavior }, '@behaviors')
    setState(!state)
    Ctx.refresh()
  }

  const disableBehavior = (behavior: string) => async () => {
    await ops.del({ behavior }, '@behaviors')
    setState(!state)
    Ctx.refresh()
  }

  useEffect(() => {
    get('@behaviors')
  }, [])

  return (
    <div className="columns behaviors">
      <div className="column is-8 is-size-7">
        <h2 className="title is-size-5 has-text-grey-dark">
          {intl.formatMessage(genericMessages.behaviors)}
        </h2>
        {!loading && !isError && result && (
          <Fragment>
            <Table>
              <tr>
                <td colSpan={3}>
                  <h3 className="title is-size-6">
                    {intl.formatMessage(genericMessages.static)}
                  </h3>
                </td>
              </tr>
              {result.static.map((behavior) => (
                <tr key={behavior}>
                  <td>{intl.formatMessage(genericMessages.static)}</td>
                  <td>{behavior}</td>
                  <td className="">
                    <Button className="is-small is-pulled-right" disabled>
                      {intl.formatMessage(genericMessages.disable)}
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            <Table>
              <tr>
                <td colSpan={3}>
                  <h3 className="title is-size-6">
                    {intl.formatMessage(genericMessages.enabled)}
                  </h3>
                </td>
              </tr>
              {result.dynamic.map((behavior) => (
                <tr key={behavior}>
                  <td>{intl.formatMessage(genericMessages.enabled)}</td>
                  <td>{behavior}</td>
                  <td>
                    <Button
                      className="is-small is-danger is-pulled-right"
                      onClick={disableBehavior(behavior)}
                    >
                      {intl.formatMessage(genericMessages.disable)}
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            <Table>
              <tr>
                <td colSpan={3}>
                  <h3 className="title is-size-6">
                    {intl.formatMessage(genericMessages.available)}
                  </h3>
                </td>
              </tr>
              {result.available.map((behavior) => (
                <tr key={behavior}>
                  <td>{intl.formatMessage(genericMessages.available)}</td>
                  <td>{behavior}</td>
                  <td>
                    <Button
                      className="is-small is-primary is-pulled-right"
                      onClick={enableBehavior(behavior)}
                    >
                      {intl.formatMessage(genericMessages.enable)}
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </Fragment>
        )}
      </div>
      <div className="column is-4"></div>
    </div>
  )
}
