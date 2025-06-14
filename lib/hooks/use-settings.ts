import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsAPI } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.get,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsAPI.update,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast({
        title: "Success",
        description: response.message || "Settings updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      })
    },
  })
}
