"use client"

import type React from "react"

import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useMeals, useDeleteMeal } from "@/lib/hooks/use-meals"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MealForm } from "@/components/meal-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Meal } from "@/lib/api-service"

export default function Dashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    type: true,
    originPrice: true,
    discountPrice: true,
    actions: true,
  })

  // Fetch meals data with pagination and search
  const {
    data: mealsResponse,
    isLoading,
    error,
  } = useMeals({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  })

  const deleteMutation = useDeleteMeal()

  const handleDelete = (meal: Meal) => {
    setDeletingMeal(meal)
  }

  const handleConfirmDelete = async () => {
    if (deletingMeal) {
      await deleteMutation.mutateAsync(deletingMeal._id)
      setDeletingMeal(null)
    }
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setIsAddFormOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activePage="food" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="#" className="text-gray-500 mr-6">
              Dashboard overview
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="text" placeholder="Search all" className="pl-10 pr-4 py-2 w-64" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-500">
              Help guides
            </Link>
            <div className="relative">
              <span className="text-gray-500">Inbox</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm">Download client</button>
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">Meal catalogue</h1>
              <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                {mealsResponse?.total || 0} Items
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span className="text-gray-500">Select columns</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.id}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, id: checked }))}
                  >
                    ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.name}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, name: checked }))}
                  >
                    Meal Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.type}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, type: checked }))}
                  >
                    Type
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.originPrice}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, originPrice: checked }))}
                  >
                    Origin Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.discountPrice}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, discountPrice: checked }))}
                  >
                    Discount Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.actions}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, actions: checked }))}
                  >
                    Actions
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </form>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setEditingMeal(null)
                  setIsAddFormOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add new
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-md overflow-hidden border">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                Failed to load meals. Please try again.
                <br />
                <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      {visibleColumns.id && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">#</th>
                      )}
                      {visibleColumns.name && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Meal Name</th>
                      )}
                      {visibleColumns.type && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                      )}
                      {visibleColumns.originPrice && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Origin Price</th>
                      )}
                      {visibleColumns.discountPrice && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Discount Price</th>
                      )}
                      {visibleColumns.actions && (
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mealsResponse?.data.map((meal, index) => (
                      <tr key={meal._id} className="hover:bg-gray-50">
                        {visibleColumns.id && (
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {String((currentPage - 1) * 10 + index + 1).padStart(2, "0")}
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-6 py-4 text-sm text-gray-900">{meal.name}</td>
                        )}
                        {visibleColumns.type && (
                          <td className="px-6 py-4 text-sm text-gray-500">{meal.type}</td>
                        )}
                        {visibleColumns.originPrice && (
                          <td className="px-6 py-4 text-sm text-gray-500">${meal.originPrice}</td>
                        )}
                        {visibleColumns.discountPrice && (
                          <td className="px-6 py-4 text-sm text-gray-500">${meal.discountPrice}</td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-6 py-4 text-sm text-gray-500 flex gap-4">
                            <button className="text-purple-600 hover:text-purple-900" onClick={() => handleEdit(meal)}>
                              Edit
                            </button>
                            <button
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                              onClick={() => handleDelete(meal)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {mealsResponse && Math.ceil(mealsResponse.total / mealsResponse.limit) > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full border disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>

                      {Array.from({ length: Math.min(5, Math.ceil(mealsResponse.total / mealsResponse.limit)) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentPage === page ? "bg-pink-500 text-white" : "text-gray-500 hover:bg-gray-100"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        className="p-1 rounded-full border disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(mealsResponse.total / mealsResponse.limit), prev + 1))}
                        disabled={currentPage === Math.ceil(mealsResponse.total / mealsResponse.limit)}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * mealsResponse.limit + 1} to {Math.min(currentPage * mealsResponse.limit, mealsResponse.total)} of{" "}
                        {mealsResponse.total} items
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Forms and Dialogs */}
      {isAddFormOpen && <MealForm meal={editingMeal} onClose={() => setIsAddFormOpen(false)} />}
      
      <ConfirmDialog
        isOpen={!!deletingMeal}
        onClose={() => setDeletingMeal(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Meal"
        description={`Are you sure you want to delete "${deletingMeal?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Toaster />
    </div>
  )
}
