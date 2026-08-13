import { type ReactNode } from 'react'

interface PopupPros {
  id: string
  children?: ReactNode
  actions?: ReactNode
  ref?: React.Ref<HTMLDialogElement>
}

/**
 * Needs to be open with ref showModal
 */
export const Modal = (props: PopupPros) => {
  const { id, actions, children, ref } = props
  return (
    <dialog id={id} className="modal" ref={ref}>
      <div className="modal-box max-w-md">
        {children}
        <div className="modal-action">
          <form method="dialog">
            {actions ? actions : <button className="btn">Close</button>}
          </form>
        </div>
      </div>
    </dialog>
  )
}
