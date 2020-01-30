import React from 'react'

const style = { color: '#F44336', fontSize: 20, paddingBottom: 20 }

export default class ErrorBoundary extends React.Component {
  state = {}

  componentDidCatch(error, errorInfo) {
    this.setState({ 
      hasError: true, 
      errorMsg: error.message,
      errorStack: errorInfo.componentStack
    })
  }

  render() {
    const { hasError, errorMsg, errorStack } = this.state

    if (hasError) {
      return (
        <div className="box main-panel">
          <div style={style}>Something went wrong.</div>
          {errorMsg && <p><b>{errorMsg}</b></p>}
          {errorStack && <p>{errorStack}</p>}
        </div>
      );
    }

    return this.props.children; 
  }
}