import React, { Component, createContext } from "react"

export const Context = createContext()

class ContextProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeScene: 0
    }
  }

  updateContext = (property, value, cb = () => {}) => this.setState({ [property]: value }, cb)

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          updateContext: this.updateContext
        }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default ContextProvider
