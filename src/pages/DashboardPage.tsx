import HeroNetWorth from '../components/HeroNetWorth'
import PerformanceChart from '../components/PerformanceChart'
import AllocationChart from '../components/AllocationChart'

export default function DashboardPage() {
  return (
    <>
      <HeroNetWorth />
      <div className="two-col">
        <AllocationChart />
        <PerformanceChart />
      </div>
    </>
  )
}
