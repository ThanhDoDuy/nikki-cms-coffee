import type { ShiftType } from "./api-service"

export const SHIFT_OPTIONS: { label: string; value: ShiftType }[] = [
  { label: "Morning (6AM - 2PM)", value: "Morning (6AM - 2PM)" },
  { label: "Afternoon (2PM - 10PM)", value: "Afternoon (2PM - 10PM)" },
  { label: "Night (10PM - 6AM)", value: "Night (10PM - 6AM)" },
  { label: "Full-time (9AM - 5PM)", value: "Full-time (9AM - 5PM)" },
  { label: "Part-time", value: "Part-time" },
]

export const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const 