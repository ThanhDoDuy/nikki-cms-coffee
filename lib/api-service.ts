// API service for backend communication

// Utility function to handle API timeouts
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
  const { timeout = 5000, ...fetchOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(id)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    clearTimeout(id)
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        const timeoutError = new Error("Request timeout")
        timeoutError.name = "TimeoutError"
        throw timeoutError
      }
      throw error
    }
    throw new Error("An unknown error occurred")
  }
}

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

// Generic fetch function with proper error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit & { timeout?: number } = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      timeout: 5000, // 5 seconds timeout
    })
    return response as T
  } catch (error) {
    if (error instanceof Error) {
      // Preserve the error name and message
      throw error
    }
    throw new Error("An unknown error occurred")
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
  _id?: string          // MongoDB ID
  shopName: string
  shopAddress: string
  contactPhone: string
  openingTime: string
  closingTime: string
  currency: string
  updatedAt?: string
  __v?: number         // MongoDB version key
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
  get: async () => {
    try {
      const response = await fetchAPI<Settings>("/settings")
      if (!response) {
        throw new Error("No data received from server")
      }
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to fetch settings")
    }
  },

  update: async (settings: Omit<Settings, "_id" | "updatedAt" | "__v">) => {
    try {
      const response = await fetchAPI<Settings>("/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      })
      if (!response) {
        throw new Error("No response from server")
      }
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to update settings")
    }
  },
}
