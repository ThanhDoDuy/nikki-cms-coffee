"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateStaff, useUpdateStaff } from "@/lib/hooks/use-staff"
import type { Staff, ShiftType } from "@/lib/api-service"
import { SHIFT_OPTIONS, STATUS_OPTIONS } from "@/lib/constants"

interface StaffFormProps {
  staff?: Staff | null
  onClose: () => void
}

export function StaffForm({ staff, onClose }: StaffFormProps) {
  const isEditing = !!staff

  const [formData, setFormData] = useState({
    name: "",
    shift: "" as ShiftType,
    status: "active" as "active" | "inactive",
  })

  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // Initialize form data when staff prop changes
  useEffect(() => {
    if (staff) {
      // For editing, use existing staff data
      setFormData({
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
          id: staff._id,
          data: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Staff Member" : "Add New Staff"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Select value={formData.shift} onValueChange={(value) => handleChange("shift", value as ShiftType)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {SHIFT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-status">Staff Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value as "active" | "inactive")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
