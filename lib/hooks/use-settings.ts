import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsAPI, type Settings } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: settingsAPI.get,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retrying
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: settingsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully updated.",
        variant: "default",
        duration: 3000, // Show for 3 seconds
      })
    },
    onError: (error: Error) => {
      // Check if it's a timeout error
      if (error.name === "TimeoutError" || error.message.includes("timeout")) {
        toast({
          title: "Request Timeout",
          description: "The server is taking too long to respond. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      } 
      // Check if it's a network error
      else if (error.name === "NetworkError" || !navigator.onLine) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
      // Server returned an error
      else {
        toast({
          title: "Update Failed",
          description: "No information available or server error. Please try again later.",
          variant: "destructive",
          duration: 3000,
        })
      }
    },
  })
}
