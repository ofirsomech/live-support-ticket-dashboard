import { useEffect, useMemo, useState } from 'react'
import { useStore } from './store/useTicketsStore'
import type { Ticket, TicketPriority, TicketStatus } from './types'

const statusOpts: TicketStatus[] = ['Open', 'InProgress', 'Resolved']
const priorityOpts: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']

export default function App() {
  const { tickets, agents, loading, error, loadAll, applyFilters, createTicket, updateTicket, filters } = useStore()
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' as TicketPriority })

  useEffect(() => { loadAll() }, [])
  useEffect(() => { loadAll() }, [filters.status, filters.priority, filters.search])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await createTicket(form)
    setForm({ title: '', description: '', priority: 'Medium' })
  }

  const grouped = useMemo(() => {
    return {
      Open: tickets.filter(t => t.status === 'Open'),
      InProgress: tickets.filter(t => t.status === 'InProgress'),
      Resolved: tickets.filter(t => t.status === 'Resolved'),
    }
  }, [tickets])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <div className="flex gap-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="Search..."
            onChange={(e) => applyFilters({ search: e.target.value })}
          />
          <select className="border rounded px-2 py-1" onChange={(e) => applyFilters({ status: e.target.value as TicketStatus || undefined })}>
            <option value="">All Statuses</option>
            {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="border rounded px-2 py-1" onChange={(e) => applyFilters({ priority: e.target.value as TicketPriority || undefined })}>
            <option value="">All Priorities</option>
            {priorityOpts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </header>

      <section className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="font-semibold mb-2">Create Ticket</h2>
        <form onSubmit={onCreate} className="grid md:grid-cols-4 gap-2">
          <input
            className="border rounded px-2 py-1 col-span-1 md:col-span-1"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <input
            className="border rounded px-2 py-1 col-span-1 md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <select
            className="border rounded px-2 py-1"
            value={form.priority}
            onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as TicketPriority }))}
          >
            {priorityOpts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="bg-black text-white rounded px-3 py-1 md:col-span-4 w-fit">Create</button>
        </form>
      </section>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <main className="grid md:grid-cols-3 gap-4">
        {(['Open','InProgress','Resolved'] as TicketStatus[]).map(col => (
          <TicketColumn
            key={col}
            title={col}
            items={grouped[col]}
            agents={agents}
            onUpdate={updateTicket}
          />
        ))}
      </main>
    </div>
  )
}

function TicketColumn({ title, items, agents, onUpdate }: { title: TicketStatus, items: Ticket[], agents: any[], onUpdate: (t: Ticket)=>Promise<void> }) {
  return (
    <section className="bg-white rounded-xl shadow p-3">
      <header className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-gray-500">{items.length} tickets</span>
      </header>
      <ul className="space-y-2">
        {items.map(t => <TicketCard key={t.id} t={t} agents={agents} onUpdate={onUpdate} />)}
        {items.length === 0 && <li className="text-sm text-gray-500">No tickets</li>}
      </ul>
    </section>
  )
}

function TicketCard({ t, agents, onUpdate }: { t: Ticket, agents: any[], onUpdate: (t: Ticket)=>Promise<void> }) {
  const [edit, setEdit] = useState(t)
  useEffect(() => setEdit(t), [t.id])

  const save = async () => { await onUpdate(edit) }

  return (
    <li className="border rounded-lg p-3">
      <div className="flex items-center justify-between">
        <input className="font-medium w-full mr-2 outline-none" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{edit.priority}</span>
      </div>
      <textarea className="w-full text-sm mt-1 border rounded p-2" rows={2} value={edit.description ?? ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
      <div className="flex items-center gap-2 mt-2">
        <select className="border rounded px-2 py-1 text-sm" value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value as any })}>
          <option>Open</option>
          <option>InProgress</option>
          <option>Resolved</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm" value={edit.assignedAgentId ?? ''} onChange={e => setEdit({ ...edit, assignedAgentId: e.target.value || null })}>
          <option value="">Unassigned</option>
          {agents.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <button className="ml-auto text-sm bg-black text-white rounded px-3 py-1" onClick={save}>Save</button>
      </div>
    </li>
  )
}