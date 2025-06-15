"use client"

import type React from "react"

import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useStaff, useDeleteStaff } from "@/lib/hooks/use-staff"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StaffForm } from "@/components/staff-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Staff } from "@/lib/api-service"
import { STATUS_OPTIONS } from "@/lib/constants"

export default function StaffManagement() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Fetch staff data with pagination, search, and filtering
  const {
    data: staffResponse,
    isLoading,
    error,
  } = useStaff({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  const deleteMutation = useDeleteStaff()

  const handleDelete = (staff: Staff) => {
    setDeletingStaff(staff)
  }

  const handleConfirmDelete = async () => {
    if (deletingStaff) {
      await deleteMutation.mutateAsync(deletingStaff._id)
      setDeletingStaff(null)
    }
  }

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff)
    setIsAddFormOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activePage="staff" />

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
              <h1 className="text-xl font-medium">Staff Management</h1>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {staffResponse?.total || 0} Staff
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </form>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setEditingStaff(null)
                  setIsAddFormOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-md overflow-hidden border">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                Failed to load staff data. Please try again.
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Number</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Staff Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Staff Shift</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Staff Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {staffResponse?.data.map((staff, index) => (
                      <tr key={staff._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {String((currentPage - 1) * 10 + index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{staff.shift}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              staff.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {staff.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex gap-4">
                          <button className="text-purple-600 hover:text-purple-900" onClick={() => handleEdit(staff)}>
                            Edit
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            onClick={() => handleDelete(staff)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {staffResponse && staffResponse.totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full border disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>

                      {Array.from({ length: Math.min(5, staffResponse.totalPages) }, (_, i) => {
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
                        onClick={() => setCurrentPage((prev) => Math.min(staffResponse.totalPages, prev + 1))}
                        disabled={currentPage === staffResponse.totalPages}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, staffResponse.total)} of{" "}
                        {staffResponse.total} items
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Staff Form Modal */}
      {isAddFormOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={() => {
            setIsAddFormOpen(false)
            setEditingStaff(null)
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        description={`Are you sure you want to delete "${deletingStaff?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Toaster />
    </div>
  )
}
