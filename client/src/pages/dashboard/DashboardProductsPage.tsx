import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Table } from '../../components/Table'
import { addProduct, deleteProduct, editProduct } from '../../lib/api'
import { formatCents, getImageUrl } from '../../util/util'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { CreateProductRequest, Product, UpdateProductRequest } from 'shared'
import { useState } from 'react'
import { ProductFormModal } from '../../components/ProductFormModal'
import { Image } from '../../components/Image'
import { adminProductsQuery } from '../../routes/products'

const DashboardProductsPage = () => {
  const { data: products } = useSuspenseQuery(adminProductsQuery())

  const client = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  // product selected to edit
  const [product, setProduct] = useState<Product>()

  const [formKey, setFormKey] = useState(Date.now())
  const productDeleteMutation = useMutation({
    mutationKey: ['products', 'admin'],
    mutationFn: (id: string) => deleteProduct(id),
    onMutate: (id) => {
      client.setQueryData<Product[]>(['products', 'admin'], (prev) =>
        prev?.filter((p) => p.id !== id)
      )
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['products'] })
      client.invalidateQueries({ queryKey: ['categories'] })
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
    <div className="w-full p-2 pt-6">
      <ProductFormModal
        product={product}
        key={product ? product.id : `new-${formKey}`}
        handleAdd={handleAdd}
        handleEdit={edit}
        isOpen={isOpen}
        onClose={onClose}
      />
      <h2 className="mb-2 text-xl font-medium">Product List</h2>
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
      <div className="overflow-x-auto">
        <Table
          data={products}
          columns={[
            {
              header: '',
              accessor: (row) => <input type="checkbox" id={row.id} />
            },
            {
              header: 'Image',
              accessor: (row) => (
                <Image
                  width={100}
                  src={getImageUrl(row.image)}
                  alt={row.name}
                />
              )
            },
            {
              header: 'Name',
              accessor: (row) => row.name
            },
            {
              header: 'Price',
              accessor: (row) => formatCents(row.price)
            },
            {
              header: 'Description',
              accessor: (row) => row.description
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost btn-square"
                    onClick={() => handleEdit(row.id)}
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost btn-square"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}

export default DashboardProductsPage
