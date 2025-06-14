import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { staffAPI, type Staff } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export function useStaff(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => staffAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffAPI.getById(id),
    enabled: !!id,
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: staffAPI.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast({
        title: "Success",
        description: response.message || "Staff member created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create staff member",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) => staffAPI.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast({
        title: "Success",
        description: response.message || "Staff member updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: staffAPI.delete,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast({
        title: "Success",
        description: response.message || "Staff member deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      })
    },
  })
}
