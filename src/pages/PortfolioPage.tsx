import EntryForm from '../components/EntryForm'
import AllocationChart from '../components/AllocationChart'

export default function PortfolioPage() {
  return (
    <div className="two-col">
      <EntryForm />
      <AllocationChart />
    </div>
  )
}
