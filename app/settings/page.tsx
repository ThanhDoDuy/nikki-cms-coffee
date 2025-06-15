"use client"

import type React from "react"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSettings, useUpdateSettings } from "@/lib/hooks/use-settings"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Settings } from "@/lib/api-service"

export default function SettingsPage() {
  const [formData, setFormData] = useState<Settings>({
    shopName: "",
    shopAddress: "",
    contactPhone: "",
    openingTime: "",
    closingTime: "",
    currency: "USD",
  })

  // Fetch settings data
  const { data: settings, isLoading, error } = useSettings()

  const updateMutation = useUpdateSettings()

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleChange = (field: keyof Settings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Remove _id, updatedAt, and __v from formData before sending
      const { _id, updatedAt, __v, ...updateData } = formData
      await updateMutation.mutateAsync(updateData)
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully updated.",
        variant: "default",
        duration: 3000,
      })
    } catch (error) {
      console.error("Settings update error:", error)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activePage="settings" />

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
          <div className="mb-6">
            <h1 className="text-xl font-medium">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your coffee shop settings and preferences</p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Failed to load settings. Please try again.
              <br />
              <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shop-name">Shop Name</Label>
                      <Input
                        id="shop-name"
                        type="text"
                        value={formData.shopName}
                        onChange={(e) => handleChange("shopName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shop-address">Shop Address</Label>
                      <textarea
                        id="shop-address"
                        value={formData.shopAddress}
                        onChange={(e) => handleChange("shopAddress", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Business Hours</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="opening-time">Opening Time</Label>
                      <Input
                        id="opening-time"
                        type="time"
                        value={formData.openingTime}
                        onChange={(e) => handleChange("openingTime", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="closing-time">Closing Time</Label>
                      <Input
                        id="closing-time"
                        type="time"
                        value={formData.closingTime}
                        onChange={(e) => handleChange("closingTime", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        required
                      >
                        <option value="USD">USD ($)</option>
                        <option value="VND">VND (₫)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>

      <Toaster />
    </div>
  )
}
