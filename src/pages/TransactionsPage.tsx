import EntryForm from '../components/EntryForm'
import TransactionList from '../components/TransactionList'

export default function TransactionsPage() {
  return (
    <div className="two-col">
      <EntryForm />
      <TransactionList />
    </div>
  )
}
