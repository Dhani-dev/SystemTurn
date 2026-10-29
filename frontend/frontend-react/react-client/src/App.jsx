import './App.css'

function App() {
  return (
    <main className="page">
      <section className="panel" aria-label="Vista del cliente">
        <Header />
        <div className="content">
          <Welcome />
        </div>
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

function Welcome() {
  return (
    <section className="welcome" aria-labelledby="saludo">
      <div>
        <h1 id="saludo">¡Hola!</h1>
        <h2>Solicita tu turno y espera a ser atendido.</h2>
        <p>Al finalizar tu solicitud, podrás ver el número de tu turno y el estado de la fila.</p>
      </div>
      <Illustration />
    </section>
  )
}

function Illustration() {
  return (
    <div className="illustration" aria-hidden="true">
      <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="72" cy="126" rx="40" ry="8" fill="#F3E8FF" />
        <path d="M44 122c2-28 12-40 28-40s26 12 28 40" fill="#7C3AED" />
        <rect x="66" y="76" width="12" height="10" rx="4" fill="#F3C7A6" />
        <circle cx="72" cy="60" r="18" fill="#F3C7A6" />
        <path d="M54 62c0-22 8-32 20-32 13 0 20 10 18 28-6-3-12 1-18 1s-14-3-20 3Z" fill="#32284A" />
        <path d="M54 66c-1 16 3 28 8 34 1-12 1-22 0-34Z" fill="#32284A" />
        <path d="M66 66c2 3 8 3 11 0" stroke="#C48A6A" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="96" y="96" width="16" height="26" rx="3" fill="#2A2340" />
        <rect x="98" y="99" width="12" height="16" rx="1.5" fill="#DDD6FE" />
        <rect x="90" y="8" width="64" height="30" rx="15" fill="#7C3AED" />
        <path d="M104 38l7 8 8-8" fill="#7C3AED" />
        <text
          x="122"
          y="27"
          textAnchor="middle"
          fill="#fff"
          fontSize="12"
          fontFamily="Segoe UI, sans-serif"
          fontWeight="700"
        >
          Ejemplo
        </text>
      </svg>
    </div>
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
