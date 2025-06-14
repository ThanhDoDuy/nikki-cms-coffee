"use client"

import type React from "react"

import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useMeals, useDeleteMeal } from "@/lib/hooks/use-meals"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MealForm } from "@/components/meal-form"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import type { Meal } from "@/lib/api-service"

export default function Dashboard() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      deleteMutation.mutate(id)
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
              <div className="flex items-center border rounded-md">
                <span className="px-3 py-2 text-gray-500">Select column</span>
                <ChevronDown className="mr-2 h-4 w-4 text-gray-500" />
              </div>
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">#</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Meal Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Origin Price</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Discount Price</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mealsResponse?.data.map((meal, index) => (
                      <tr key={meal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {String((currentPage - 1) * 10 + index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{meal.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{meal.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">${meal.originPrice}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">${meal.discountPrice}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex gap-4">
                          <button className="text-purple-600 hover:text-purple-900" onClick={() => handleEdit(meal)}>
                            Edit
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            onClick={() => handleDelete(meal.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {mealsResponse && mealsResponse.totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full border disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>

                      {Array.from({ length: Math.min(5, mealsResponse.totalPages) }, (_, i) => {
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
                        onClick={() => setCurrentPage((prev) => Math.min(mealsResponse.totalPages, prev + 1))}
                        disabled={currentPage === mealsResponse.totalPages}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, mealsResponse.total)} of{" "}
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

      {/* Add/Edit Meal Form Modal */}
      {isAddFormOpen && (
        <MealForm
          meal={editingMeal}
          onClose={() => {
            setIsAddFormOpen(false)
            setEditingMeal(null)
          }}
        />
      )}

      <Toaster />
    </div>
  )
}
