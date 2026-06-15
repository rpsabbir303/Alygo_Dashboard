import { useMemo, useState } from 'react'
import { Drawer, Menu } from 'antd'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { NAVIGATION } from '@/constants/navigation'
import { usePermissions } from '@/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMobileSidebarOpen, toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/utils/cn'

function filterNavByPermissions(items: typeof NAVIGATION, hasPermission: ReturnType<typeof usePermissions>['hasPermission']) {
  return items
    .filter((item) => !item.permission || hasPermission(item.permission))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => !child.permission || hasPermission(child.permission)),
    }))
    .filter((item) => !item.children || item.children.length > 0)
}

export function Sidebar() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const mobileOpen = useAppSelector((state) => state.ui.mobileSidebarOpen)
  const { hasPermission } = usePermissions()
  const [openKeys, setOpenKeys] = useState<string[]>(['operations'])

  const navItems = useMemo(() => filterNavByPermissions(NAVIGATION, hasPermission), [hasPermission])

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    children: item.children?.map((child) => ({
      key: child.key,
      label: <Link to={child.path!}>{child.label}</Link>,
    })),
  }))

  const selectedKeys = useMemo(() => {
    const flat = navItems.flatMap((item) =>
      item.children ? item.children.map((c) => ({ key: c.key, path: c.path })) : [{ key: item.key, path: item.path }],
    )
    const match = flat.find((item) => item.path === location.pathname)
    return match ? [match.key] : ['dashboard']
  }, [location.pathname, navItems])

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        <Link to="/" className={cn('overflow-hidden transition-all', collapsed ? 'mx-auto' : 'w-auto opacity-100')}>
          {collapsed ? (
            <BrandLogo size="sm" imageClassName="!rounded-lg" />
          ) : (
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" imageClassName="!rounded-lg" />
              <div>
                <p className="text-sm font-semibold text-white">Alygo</p>
                <p className="text-[11px] uppercase tracking-wider text-[#94A3B8]">Operations</p>
              </div>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-alygo-text-muted hover:bg-white/5 lg:block"
          onClick={() => dispatch(toggleSidebar())}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto page-scroll py-3">
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          className="!border-none !bg-transparent"
        />
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          'hidden h-screen shrink-0 border-r border-white/5 bg-[rgba(15,17,23,0.92)] backdrop-blur-xl transition-all lg:block',
          collapsed ? 'w-[80px]' : 'w-[280px]',
        )}
      >
        {sidebarContent}
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
        placement="left"
        size={280}
        className="lg:hidden"
        styles={{ body: { padding: 0, background: '#0f1117' } }}
      >
        {sidebarContent}
      </Drawer>
    </>
  )
}
