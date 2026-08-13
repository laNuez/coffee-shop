import { ReactNode } from 'react'

interface Column<T> {
  header: string
  accessor: (row: T) => ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
}
export const Table = <T,>(props: TableProps<T>) => {
  const { data, columns } = props
  return (
    <table className="table-sm md:table-md table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.header}>{column.accessor(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
