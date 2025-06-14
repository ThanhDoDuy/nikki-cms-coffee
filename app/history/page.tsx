"use client"

import type React from "react"

import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useOrders, useOrderStats } from "@/lib/hooks/use-orders"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HistoryOrder() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Fetch order history data
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useOrders({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    dateFrom,
    dateTo,
  })

  // Fetch order statistics
  const { data: stats, isLoading: statsLoading } = useOrderStats()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting data...")
    // You can implement CSV/PDF export here
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activePage="history" />

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
              <h1 className="text-xl font-medium">Order History</h1>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                {ordersResponse?.total || 0} Orders
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                  placeholder="From date"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                  placeholder="To date"
                />
              </div>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </form>
              <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-md overflow-hidden border">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                Failed to load order history. Please try again.
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order Number</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Table</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Meals</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ordersResponse?.data.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.date).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.table}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs">
                            <span className="text-gray-900">{order.meals}</span>
                            <div className="text-xs text-gray-400">{order.itemCount} items</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">${order.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {ordersResponse && ordersResponse.totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full border disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                      </button>

                      {Array.from({ length: Math.min(5, ordersResponse.totalPages) }, (_, i) => {
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
                        onClick={() => setCurrentPage((prev) => Math.min(ordersResponse.totalPages, prev + 1))}
                        disabled={currentPage === ordersResponse.totalPages}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, ordersResponse.total)} of{" "}
                        {ordersResponse.total} items
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsLoading ? (
              <div className="col-span-3">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-500">Total Orders Today</div>
                  <div className="text-2xl font-bold text-gray-900">{stats?.todayOrders || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-500">Total Revenue Today</div>
                  <div className="text-2xl font-bold text-green-600">${(stats?.todayRevenue || 0).toFixed(2)}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-500">Average Order Value</div>
                  <div className="text-2xl font-bold text-blue-600">${(stats?.averageOrderValue || 0).toFixed(2)}</div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
