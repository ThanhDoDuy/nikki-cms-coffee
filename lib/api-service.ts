// API service for backend communication

// Base URL for API requests - you can change this to your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${getToken()}`,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Types
export interface Meal {
  _id: string
  name: string
  type: "Main meal" | "Dessert" | "Drink" | "Appetizer" | "Side dish"
  originPrice: number
  discountPrice: number
  createdAt?: string
  updatedAt?: string
}

export type ShiftType = 
  | "Morning (6AM - 2PM)"
  | "Afternoon (2PM - 10PM)"
  | "Night (10PM - 6AM)"
  | "Full-time (9AM - 5PM)"
  | "Part-time"

export interface Staff {
  _id: string
  name: string
  shift: ShiftType
  status: "active" | "inactive"
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  _id: string
  orderNumber: string
  date: string
  table: string
  meals: string
  itemCount: number
  totalPrice: number
  status?: string
  createdAt?: string
}

export interface Settings {
  id?: string
  shopName: string
  shopAddress: string
  contactPhone: string
  openingTime: string
  closingTime: string
  currency: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Meal API functions
export const mealAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)

    const query = searchParams.toString()
    return fetchAPI<PaginatedResponse<Meal>>(`/meals${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchAPI<ApiResponse<Meal>>(`/meals/${id}`),

  create: (meal: Omit<Meal, "_id" | "createdAt" | "updatedAt">) =>
    fetchAPI<ApiResponse<Meal>>("/meals", {
      method: "POST",
      body: JSON.stringify(meal),
    }),

  update: (id: string, meal: Partial<Omit<Meal, "_id" | "createdAt" | "updatedAt">>) =>
    fetchAPI<ApiResponse<Meal>>(`/meals/${id}`, {
      method: "PUT",
      body: JSON.stringify(meal),
    }),

  delete: (id: string) => fetchAPI<ApiResponse<void>>(`/meals/${id}`, { method: "DELETE" }),
}

// Staff API functions
export const staffAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)

    const query = searchParams.toString()
    return fetchAPI<PaginatedResponse<Staff>>(`/staff${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchAPI<ApiResponse<Staff>>(`/staff/${id}`),

  create: (staff: Omit<Staff, "_id" | "createdAt" | "updatedAt">) =>
    fetchAPI<ApiResponse<Staff>>("/staff", {
      method: "POST",
      body: JSON.stringify(staff),
    }),

  update: (id: string, staff: Partial<Omit<Staff, "_id" | "createdAt" | "updatedAt">>) =>
    fetchAPI<ApiResponse<Staff>>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(staff),
    }),

  delete: (id: string) => fetchAPI<ApiResponse<void>>(`/staff/${id}`, { method: "DELETE" }),
}

// Order API functions (read-only)
export const orderAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; dateFrom?: string; dateTo?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom)
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo)

    const query = searchParams.toString()
    return fetchAPI<PaginatedResponse<Order>>(`/orders${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchAPI<ApiResponse<Order>>(`/orders/${id}`),

  getStats: () =>
    fetchAPI<{
      totalOrders: number
      totalRevenue: number
      averageOrderValue: number
      todayOrders: number
      todayRevenue: number
    }>("/orders/stats"),
}

// Settings API functions
export const settingsAPI = {
  get: () => fetchAPI<ApiResponse<Settings>>("/settings"),

  update: (settings: Omit<Settings, "id" | "updatedAt">) =>
    fetchAPI<ApiResponse<Settings>>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
}
