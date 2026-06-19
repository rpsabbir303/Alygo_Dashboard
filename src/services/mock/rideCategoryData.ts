import { mockDrivers, mockReservations, mockTrips } from '@/services/mock/data'
import type { RideCategoryDefinition } from '@/types/rideCategoryManagement'
import type { RideCategory } from '@/types'

export const mockRideCategories: RideCategoryDefinition[] = [
  {
    id: 'RC-1',
    name: 'Standard',
    slug: 'standard',
    description: 'Everyday affordable rides for daily commuting.',
    fareMultiplier: 1.0,
    minDriverRating: 4.5,
    vehicleRequirements: '2015+ sedan, 4 seats, valid inspection',
    status: 'enabled',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'RC-2',
    name: 'Comfort',
    slug: 'comfort',
    description: 'Newer vehicles with extra legroom and comfort features.',
    fareMultiplier: 1.25,
    minDriverRating: 4.6,
    vehicleRequirements: '2018+ sedan, 4 seats, premium interior',
    status: 'enabled',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'RC-3',
    name: 'XL',
    slug: 'xl',
    description: 'Extra passenger and luggage capacity for groups.',
    fareMultiplier: 1.5,
    minDriverRating: 4.5,
    vehicleRequirements: '2017+ SUV or van, 6+ seats',
    status: 'enabled',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'RC-4',
    name: 'Pet',
    slug: 'pet',
    description: 'Pet-friendly rides with trained drivers.',
    fareMultiplier: 1.15,
    minDriverRating: 4.7,
    vehicleRequirements: 'Pet-friendly vehicle, seat covers, air filtration',
    status: 'enabled',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'RC-5',
    name: 'Priority',
    slug: 'priority',
    description: 'Faster pickup with priority dispatch.',
    fareMultiplier: 1.35,
    minDriverRating: 4.7,
    vehicleRequirements: '2018+ vehicle, high acceptance rate drivers',
    status: 'enabled',
    createdAt: '2024-04-05T10:00:00Z',
  },
  {
    id: 'RC-6',
    name: 'Black',
    slug: 'black',
    description: 'Premium executive sedan experience.',
    fareMultiplier: 2.5,
    minDriverRating: 4.8,
    vehicleRequirements: '2019+ luxury sedan, commercial insurance required',
    status: 'enabled',
    createdAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'RC-7',
    name: 'Black SUV',
    slug: 'black_suv',
    description: 'Premium SUV for executive and group travel.',
    fareMultiplier: 2.8,
    minDriverRating: 4.8,
    vehicleRequirements: '2019+ luxury SUV, 6 seats, commercial insurance required',
    status: 'enabled',
    createdAt: '2024-05-20T10:00:00Z',
  },
]

export function toRideCategorySlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function isRideCategoryInUse(slug: string): boolean {
  const key = slug as RideCategory
  return (
    mockTrips.some((t) => t.category === key) ||
    mockDrivers.some((d) => d.categories.includes(key)) ||
    mockReservations.some((r) => r.category === key)
  )
}
