import { useEffect } from 'react'
import { message } from 'antd'
import { destinationFilterApi } from '@/services/destinationFilterApi'
import { socketService } from '@/services/socket'
import { useAppDispatch } from '@/store/hooks'

export function useDestinationFilterRealtime() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const invalidate = () => {
      dispatch(
        destinationFilterApi.util.invalidateTags([
          'TierFilterSettings',
          'DestinationFilterOverview',
          'DestinationFilterAnalytics',
        ]),
      )
    }

    socketService.on('destination-filter:usage-update', invalidate)
    socketService.on('destination-filter:settings-update', invalidate)
    socketService.on('destination-filter:stats-update', invalidate)

    const demoInterval = window.setInterval(() => {
      message.info('Destination filter usage updated')
      invalidate()
    }, 120000)

    return () => {
      socketService.off('destination-filter:usage-update', invalidate)
      socketService.off('destination-filter:settings-update', invalidate)
      socketService.off('destination-filter:stats-update', invalidate)
      window.clearInterval(demoInterval)
    }
  }, [dispatch])
}
