import { DashboardLayout } from './components/layout/DashboardLayout'
import { Dashboard } from './components/dashboard/Dashboard'
import { NotificationProvider } from './components/NotificationSystem'

export default function App() {
  return (
    <NotificationProvider>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </NotificationProvider>
  )
}