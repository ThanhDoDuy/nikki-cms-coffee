"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStaff, useUpdateStaff } from "@/lib/hooks/use-staff"
import type { Staff } from "@/lib/api-service"

interface StaffFormProps {
  staff?: Staff | null
  onClose: () => void
}

export function StaffForm({ staff, onClose }: StaffFormProps) {
  const isEditing = !!staff

  const [formData, setFormData] = useState({
    number: "",
    name: "",
    shift: "",
    status: "active" as "active" | "inactive",
  })

  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Initialize form data when staff prop changes
  useEffect(() => {
    if (staff) {
      setFormData({
        number: staff.number,
        name: staff.name,
        shift: staff.shift,
        status: staff.status,
      })
    }
  }, [staff])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && staff) {
        await updateMutation.mutateAsync({
          id: staff.id,
          data: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      // Error is handled by the mutation hooks
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Staff Member" : "Add New Staff"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="staff-number">Staff Number</Label>
            <Input
              id="staff-number"
              placeholder="Enter staff number (e.g., 001)"
              value={formData.number}
              onChange={(e) => handleChange("number", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-name">Staff Name</Label>
            <Input
              id="staff-name"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-shift">Staff Shift</Label>
            <Select value={formData.shift} onValueChange={(value) => handleChange("shift", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning (6AM - 2PM)">Morning (6AM - 2PM)</SelectItem>
                <SelectItem value="Afternoon (2PM - 10PM)">Afternoon (2PM - 10PM)</SelectItem>
                <SelectItem value="Night (10PM - 6AM)">Night (10PM - 6AM)</SelectItem>
                <SelectItem value="Full-time (9AM - 5PM)">Full-time (9AM - 5PM)</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-status">Staff Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
