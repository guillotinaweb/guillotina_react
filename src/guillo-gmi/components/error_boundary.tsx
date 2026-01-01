import { Component, ErrorInfo } from 'react'
import { IntlShape, injectIntl } from 'react-intl'

const style = { color: '#F44336', fontSize: 20, paddingBottom: 20 }

class ErrorBoundaryComponent extends Component<
  { intl: IntlShape; children: React.ReactNode },
  { hasError: boolean; errorMsg: string; errorStack: string | null | undefined }
> {
  state = {
    hasError: false,
    errorMsg: '',
    errorStack: '',
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

// @ts-expect-error - injectIntl from react-intl has type incompatibility with React 19
// The HOC returns a component that accepts { children: React.ReactNode } but TypeScript
// can't infer this correctly due to version mismatches between @types/react versions.
// This is a known issue with react-intl and newer React types.
const ErrorBoundaryWithIntl = injectIntl(ErrorBoundaryComponent)
export const ErrorBoundary: React.ComponentType<{ children: React.ReactNode }> =
  ErrorBoundaryWithIntl
