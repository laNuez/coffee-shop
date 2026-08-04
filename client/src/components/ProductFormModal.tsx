import { FormEvent, useEffect, useRef } from 'react'
import { Product, ProductForm } from 'shared'
import { formatCents } from '../util/util'

type Props = {
  product?: Product
  handleAdd: (data: ProductForm) => void
  isOpen: boolean
  onClose: () => void
  error?: string
}

export const ProductFormModal = (props: Props) => {
  const { product, onClose, isOpen, handleAdd } = props

  const isEdit = !!product

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current) return

    if (isOpen) return dialogRef.current.showModal()
    dialogRef.current.close()
  }, [isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const price = formData.get('price') as string

    // TODO
    if (isEdit) {
      return
    }

    handleAdd({
      category: category,
      description: description,
      name: name,
      price: Number(price)
    })
  }

  return (
    <>
      <dialog className="modal" ref={dialogRef} onClose={() => onClose()}>
        <div className="modal-box flex flex-col items-center">
          <h3 className="text-lg font-bold">
            {isEdit ? 'Edit listing' : 'Add listing'}
          </h3>
          <form
            id="form"
            onSubmit={handleSubmit}
            className="w-96"
            method="post"
          >
            <fieldset className="fieldset p-2">
              <div>
                <legend className="fieldset-legend">Name</legend>
                <input
                  className="input validator w-full"
                  name="name"
                  id="name"
                  required={!isEdit}
                  minLength={6}
                  defaultValue={product?.name}
                />
                <div className="validator-hint mt-0 hidden">
                  Must be at least 6 characters
                </div>
              </div>
              <div>
                <legend className="fieldset-legend">Description</legend>
                <textarea
                  className="textarea validator w-full"
                  name="description"
                  id="description"
                  required={!isEdit}
                  minLength={3}
                  maxLength={3000}
                  defaultValue={product?.description}
                />
                <div className="validator-hint mt-0 hidden">
                  Must be between 3 and 3000 characters
                </div>
              </div>
              <div>
                <legend className="fieldset-legend">Category</legend>
                <input
                  className="input validator w-full"
                  name="category"
                  id="category"
                  required={!isEdit}
                  minLength={3}
                  defaultValue={product?.category}
                />
                <div className="validator-hint mt-0 hidden">
                  Must be at least 3 characters
                </div>
              </div>
              <div>
                <legend className="fieldset-legend">Price</legend>
                <input
                  className="input validator w-full"
                  type="number"
                  name="price"
                  id="price"
                  required={!isEdit}
                  min={100}
                  defaultValue={product?.price}
                />
                <div className="validator-hint mt-0 hidden">
                  Must be at least ${formatCents(100)}
                </div>
              </div>
              <div>
                <legend className="fieldset-legend">Image</legend>
                <input
                  type="file"
                  className="file-input w-full"
                  accept=".png, .jpg, .jpeg"
                />
                <legend className="fieldset-label">.png, jpg, jpeg</legend>
              </div>
            </fieldset>
          </form>
          <div className="modal-action w-full">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-accent" type="submit" form="form">
                {isEdit ? 'Save' : 'Add'}
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
