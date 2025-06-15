"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateMeal, useUpdateMeal } from "@/lib/hooks/use-meals"
import type { Meal } from "@/lib/api-service"

interface MealFormProps {
  meal?: Meal | null
  onClose: () => void
}

const MEAL_TYPES = ["Main meal", "Dessert", "Drink", "Appetizer", "Side dish"] as const

export function MealForm({ meal, onClose }: MealFormProps) {
  const isEditing = !!meal

  const [formData, setFormData] = useState<{
    name: string;
    type: Meal["type"];
    originPrice: number;
    discountPrice: number;
  }>({
    name: meal?.name || "",
    type: meal?.type || "Main meal",
    originPrice: meal?.originPrice || 0,
    discountPrice: meal?.discountPrice || 0,
  })

  const createMutation = useCreateMeal()
  const updateMutation = useUpdateMeal()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleChange = (field: string, value: string | number) => {
    console.log(`Changing ${field} to:`, value)
    setFormData((prev) => ({
      ...prev,
      [field]: field === "type" ? (value as Meal["type"]) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && meal?._id) {
        await updateMutation.mutateAsync({
          id: meal._id,
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
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Meal" : "Add New Meal"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input
              id="name"
              placeholder="Enter meal name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type}
              onValueChange={(value: Meal["type"]) => handleChange("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin-price">Origin Price ($)</Label>
            <Input
              id="origin-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.originPrice}
              onChange={(e) => handleChange("originPrice", Number.parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-price">Discount Price ($)</Label>
            <Input
              id="discount-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.discountPrice}
              onChange={(e) => handleChange("discountPrice", Number.parseFloat(e.target.value) || 0)}
              required
            />
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
