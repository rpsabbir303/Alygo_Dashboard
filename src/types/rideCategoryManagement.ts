export type RideCategoryStatus = 'enabled' | 'disabled'

export interface RideCategoryDefinition {
  id: string
  name: string
  slug: string
  description: string
  fareMultiplier: number
  minDriverRating: number
  vehicleRequirements: string
  status: RideCategoryStatus
  createdAt: string
}

export interface RideCategoryFormValues {
  name: string
  description: string
  fareMultiplier: number
  minDriverRating: number
  vehicleRequirements: string
  status: RideCategoryStatus
}

export interface RideCategoryListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: RideCategoryStatus | ''
}

export interface RideCategoryListResponse {
  data: RideCategoryDefinition[]
  total: number
  page: number
  pageSize: number
}
