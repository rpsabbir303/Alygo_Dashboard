import { useEffect } from 'react'
import { message } from 'antd'
import { driverCapacityApi } from '@/services/driverCapacityApi'
import { socketService } from '@/services/socket'
import { useAppDispatch } from '@/store/hooks'

export function useDriverCapacityRealtime() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const invalidate = () => {
      dispatch(
        driverCapacityApi.util.invalidateTags([
          'CapacityOverview',
          'DriverCapSettings',
          'WaitlistDrivers',
          'CapacityAutoRules',
        ]),
      )
    }

    const handler = () => {
      message.info('Driver capacity updated')
      invalidate()
    }

    socketService.on('driver-capacity:waitlist-update', handler)
    socketService.on('driver-capacity:cap-update', handler)
    socketService.on('driver-capacity:stats-update', invalidate)

    const demoInterval = window.setInterval(invalidate, 120000)

    return () => {
      socketService.off('driver-capacity:waitlist-update', handler)
      socketService.off('driver-capacity:cap-update', handler)
      socketService.off('driver-capacity:stats-update', invalidate)
      window.clearInterval(demoInterval)
    }
  }, [dispatch])
}
