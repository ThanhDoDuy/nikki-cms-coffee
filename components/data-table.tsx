"use client"

import { Button } from "@/components/ui/button"

interface TableColumn {
  header: string
  accessor: string
}

interface TableData {
  [key: string]: string | number
}

interface DataTableProps {
  columns: TableColumn[]
  data: TableData[]
  onEdit: (id: string | number) => void
  onDelete: (id: string | number) => void
}

export function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="bg-white rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm text-gray-500">
                  {row[column.accessor]}
                </td>
              ))}
              <td className="px-6 py-4 text-sm text-gray-500 flex gap-4">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-900 p-0 h-auto"
                  onClick={() => onEdit(row.id || rowIndex)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-900 p-0 h-auto"
                  onClick={() => onDelete(row.id || rowIndex)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
