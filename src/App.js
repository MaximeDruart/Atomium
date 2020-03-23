import React from "react"
import AppWrap from "./AppWrap"
import ContextProvider from "./Context"

const App = () => {
  return (
    <ContextProvider>
      <AppWrap />
    </ContextProvider>
  )
}

export default App
