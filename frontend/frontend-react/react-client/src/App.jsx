import './App.css'

function App() {
  return (
    <main className="page">
      <section className="panel" aria-label="Vista del cliente">
        <Header />
      </section>
    </main>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <TicketIcon />
        <strong>Fila Virtual de Turnos</strong>
      </div>
      <div className="role">
        <UserIcon />
        <span>Cliente</span>
      </div>
    </header>
  )
}

function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V10a1.5 1.5 0 0 0 0 3v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 14.5V13a1.5 1.5 0 0 0 0-3V8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9 9.5v5M12 9.5v5M15 9.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 18.5c1.2-2.6 3.2-3.8 6-3.8s4.8 1.2 6 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default App
