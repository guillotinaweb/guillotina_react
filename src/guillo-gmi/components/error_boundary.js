import React from 'react'
import { injectIntl } from 'react-intl'

const style = { color: '#F44336', fontSize: 20, paddingBottom: 20 }

class ErrorBoundaryComponent extends React.Component {
  state = {}

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      errorMsg: error.message,
      errorStack: errorInfo.componentStack,
    })
  }

  render() {
    const { hasError, errorMsg, errorStack } = this.state

    if (hasError) {
      return (
        <div className="box main-panel">
          <div style={style}>
            {this.props.intl.formatMessage({
              id: 'something_went_wrong',
              defaultMessage: 'Something went wrong.',
            })}
          </div>
          {errorMsg && (
            <p>
              <b>{errorMsg}</b>
            </p>
          )}
          {errorStack && <p>{errorStack}</p>}
        </div>
      )
    }

    return this.props.children
  }
}

export default injectIntl(ErrorBoundaryComponent)
