import { useQuery } from "@tanstack/react-query"
import { orderAPI } from "@/lib/api-service"

export function useOrders(params?: {
  page?: number
  limit?: number
  search?: string
  dateFrom?: string
  dateTo?: string
}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderAPI.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderAPI.getById(id),
    enabled: !!id,
  })
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: orderAPI.getStats,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}
