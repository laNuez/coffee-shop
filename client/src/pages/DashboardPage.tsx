import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { addProduct, deleteProduct, editProduct, getProducts } from '../lib/api'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ProductFormModal } from '../components/ProductFormModal'
import { useState } from 'react'
import { CreateProductRequest, Product, UpdateProductRequest } from 'shared'
import { formatCents } from '../util/util'
import { getImageUrl } from '../util/util'

const productsQuery = () =>
  queryOptions({
    queryKey: ['products', 'admin'],
    queryFn: () => getProducts()
  })

export const loader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData(productsQuery())
}

const DashboardPage = () => {
  const { data: products } = useSuspenseQuery(productsQuery())

  const client = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  // product selected to edit
  const [product, setProduct] = useState<Product>()

  const [formKey, setFormKey] = useState(Date.now())
  const productDeleteMutation = useMutation({
    mutationKey: ['products', 'admin'],
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const productAddMutation = useMutation({
    mutationKey: ['products', 'admin'],
    mutationFn: (data: CreateProductRequest<File>) => addProduct(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['products'] })
      setProduct(undefined)
      setIsOpen(false)
      setFormKey(Date.now())
    }
  })

  const productEditMutation = useMutation({
    mutationKey: ['products', 'admin'],
    mutationFn: ({
      id,
      data
    }: {
      id: string
      data: UpdateProductRequest<File>
    }) => editProduct(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['products'] })
      setProduct(undefined)
      setIsOpen(false)
      setFormKey(Date.now())
    }
  })

  const handleEdit = (id: string) => {
    const p = products.find((p) => p.id == id)
    if (!p) throw new Error('product missing')
    setProduct(() => p)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    productDeleteMutation.mutate(id)
  }

  const handleAdd = (data: CreateProductRequest<File>) => {
    productAddMutation.mutate(data)
  }

  const edit = (id: string, data: UpdateProductRequest<File>) => {
    productEditMutation.mutate({
      id,
      data
    })
  }

  const onClose = () => {
    setProduct(undefined)
    setIsOpen(false)
  }

  return (
    <div className="m-8 mt-2">
      <h2 className="text-xl">Product List</h2>

      <ProductFormModal
        product={product}
        key={product ? product.id : `new-${formKey}`}
        handleAdd={handleAdd}
        handleEdit={edit}
        isOpen={isOpen}
        onClose={onClose}
      />
      <div>
        <button
          type="button"
          className="btn btn-accent"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <Plus />
          ADD
        </button>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <input type="checkbox" id={p.id} />
                </td>
                <td>
                  <img
                    width={'100px'}
                    src={getImageUrl(p.image)}
                    alt={p.name}
                  />
                </td>
                <td>{p.name}</td>
                <td>{formatCents(p.price)}</td>
                <td>{p.description}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost btn-square"
                      onClick={() => handleEdit(p.id)}
                    >
                      <Pencil />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost btn-square"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage
