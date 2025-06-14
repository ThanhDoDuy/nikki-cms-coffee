import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mealAPI, type Meal } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export function useMeals(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["meals", params],
    queryFn: () => mealAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ["meals", id],
    queryFn: () => mealAPI.getById(id),
    enabled: !!id,
  })
}

export function useCreateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mealAPI.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast({
        title: "Success",
        description: response.message || "Meal created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create meal",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meal> }) => mealAPI.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast({
        title: "Success",
        description: response.message || "Meal updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update meal",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteMeal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mealAPI.delete,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast({
        title: "Success",
        description: response.message || "Meal deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete meal",
        variant: "destructive",
      })
    },
  })
}
