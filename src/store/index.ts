import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/features/auth/services/authApi'
import { api } from '@/services/api'
import { cancellationApi } from '@/services/cancellationApi'
import { lostFoundApi } from '@/services/lostFoundApi'
import { driverRewardsApi } from '@/services/driverRewardsApi'
import { tripCompletionReviewApi } from '@/services/tripCompletionReviewApi'
import { drivingHoursApi } from '@/services/drivingHoursApi'
import { destinationFilterApi } from '@/services/destinationFilterApi'
import { operationsPolicyApi } from '@/services/operationsPolicyApi'
import { stateActivationApi } from '@/services/stateActivationApi'
import { driverCapacityApi } from '@/services/driverCapacityApi'
import { airportQueueApi } from '@/services/airportQueueApi'
import { safetyIncidentApi } from '@/services/safetyIncidentApi'
import { backgroundCheckFeeApi } from '@/services/backgroundCheckFeeApi'
import { communicationApi } from '@/services/communicationApi'
import authReducer from '@/store/slices/authSlice'
import communicationReducer from '@/store/slices/communicationSlice'
import uiReducer from '@/store/slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    communication: communicationReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cancellationApi.reducerPath]: cancellationApi.reducer,
    [lostFoundApi.reducerPath]: lostFoundApi.reducer,
    [driverRewardsApi.reducerPath]: driverRewardsApi.reducer,
    [tripCompletionReviewApi.reducerPath]: tripCompletionReviewApi.reducer,
    [drivingHoursApi.reducerPath]: drivingHoursApi.reducer,
    [destinationFilterApi.reducerPath]: destinationFilterApi.reducer,
    [operationsPolicyApi.reducerPath]: operationsPolicyApi.reducer,
    [stateActivationApi.reducerPath]: stateActivationApi.reducer,
    [driverCapacityApi.reducerPath]: driverCapacityApi.reducer,
    [airportQueueApi.reducerPath]: airportQueueApi.reducer,
    [safetyIncidentApi.reducerPath]: safetyIncidentApi.reducer,
    [backgroundCheckFeeApi.reducerPath]: backgroundCheckFeeApi.reducer,
    [communicationApi.reducerPath]: communicationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      authApi.middleware,
      cancellationApi.middleware,
      lostFoundApi.middleware,
      driverRewardsApi.middleware,
      tripCompletionReviewApi.middleware,
      drivingHoursApi.middleware,
      destinationFilterApi.middleware,
      operationsPolicyApi.middleware,
      stateActivationApi.middleware,
      driverCapacityApi.middleware,
      airportQueueApi.middleware,
      safetyIncidentApi.middleware,
      backgroundCheckFeeApi.middleware,
      communicationApi.middleware,
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
