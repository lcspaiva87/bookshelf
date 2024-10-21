import React from 'react'
// export * from './modal.exercise'

// 💯 Add `callAll`
// export * from './modal.extra-1'

// 💯 Create ModalContentsBase
// export * from './modal.extra-2'
import {Dialog} from './lib'
const ModalContext = React.createContext()

export * from './modal.final'
function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <ModalContext.Provider value={{isOpen, setIsOpen}}>
      {...props}
    </ModalContext.Provider>
  )
}

function ModalDismissButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return (
    <button onClick={() => setIsOpen(false)}>
      <span aria-hidden>×</span>
    </button>
  )
}

function ModalOpenButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
}

function ModalContents(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)

  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}
