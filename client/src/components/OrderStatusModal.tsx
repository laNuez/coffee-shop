import { FormEvent, useEffect, useRef, useState } from 'react'
import { Order, OrderRequest } from '../lib/api'

type Props = {
  order: Omit<Order, 'items'>
  handleEdit: (id: string, data: OrderRequest) => void
  onClose: () => void
}

export const OrderStatusModal = (props: Props) => {
  const { order, onClose, handleEdit } = props

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => {
      dialogRef.current?.close()
    }
  }, [])

  const [status, setStatus] = useState(order.status)
  const isSameStatus = status === order.status

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    handleEdit(order.id, { status: status })
  }

  return (
    <>
      <dialog className="modal" ref={dialogRef} onClose={onClose}>
        <div className="modal-box flex w-96 flex-col items-center">
          <h3 className="text-lg font-bold">Edit order status</h3>
          <form
            id="form"
            onSubmit={handleSubmit}
            method="post"
            className="w-full"
          >
            <fieldset className="fieldset p-2">
              <div>
                <legend className="fieldset-legend">Order ID</legend>
                <input
                  className="input"
                  type="text"
                  defaultValue={order.id}
                  disabled
                />
              </div>
              <div>
                <legend className="fieldset-legend">Status</legend>
                <select
                  autoFocus
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as NonNullable<OrderRequest['status']>
                    )
                  }
                  name="status"
                  className="select"
                  required
                >
                  <option value="preparing">preparing</option>
                  <option value="shipped">shipped</option>
                </select>
                <div className="validator-hint mt-0 hidden">
                  Must be a valid status
                </div>
              </div>
            </fieldset>
          </form>
          <div className="modal-action w-full">
            <form method="dialog" className="flex gap-2">
              <button
                className="btn btn-accent"
                type="submit"
                form="form"
                disabled={isSameStatus}
              >
                Save
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => onClose()}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
