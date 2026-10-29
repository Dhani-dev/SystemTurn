import { useRef, useState } from 'react'
import { consultarTurno, solicitarTurno, usandoSimulacion } from './services/turnosService.js'
import { etiquetaEstado, formatearMinutos, formatearNumero } from './utils/turnoFormat.js'
import './App.css'

const SIMULACION = usandoSimulacion()

function App() {
  const [turno, setTurno] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const ocupado = useRef(false)

  async function ejecutar(accion, siguientePhase) {
    if (ocupado.current) return
    ocupado.current = true
    setError('')
    setAviso('')
    setPhase(siguientePhase)
    try {
      const data = await accion()
      setTurno(data)
      setPhase('idle')
      return data
    } catch (causa) {
      setError(causa instanceof Error ? causa.message : 'Ocurrió un error inesperado.')
      setPhase('idle')
      return null
    } finally {
      ocupado.current = false
    }
  }

  function onSolicitar() {
    if (turno?.estado === 'PENDIENTE' || phase !== 'idle') return
    ejecutar(solicitarTurno, 'requesting').then((data) => {
      if (data) setAviso(`Turno ${formatearNumero(data.numero)} solicitado.`)
    })
  }

  function onActualizar() {
    if (!turno || phase !== 'idle') return
    ejecutar(() => consultarTurno(turno.numero), 'refreshing').then((data) => {
      if (data) setAviso('Estado actualizado.')
    })
  }

  const pendiente = turno?.estado === 'PENDIENTE'
  const solicitando = phase === 'requesting'
  const actualizando = phase === 'refreshing'
  const puedeSolicitar = phase === 'idle' && !pendiente

  return (
    <main className="page">
      <section className="panel" aria-label="Vista del cliente">
        <Header />
        <div className="content">
          <p className="sr-only" aria-live="polite">
            {aviso}
          </p>
          {SIMULACION && (
            <p className="banner">
              Modo demostración: el backend de turnos todavía no está conectado. Los turnos de esta
              pantalla se simulan solo en tu navegador.
            </p>
          )}
          <Welcome />
          <button
            type="button"
            className="primary"
            onClick={onSolicitar}
            disabled={solicitando || pendiente || actualizando}
            aria-busy={solicitando}
          >
            <TicketIcon />
            <span>
              {solicitando
                ? 'Solicitando turno...'
                : pendiente
                  ? 'Ya tienes un turno'
                  : 'Solicitar turno'}
            </span>
            <span className="arrow">{puedeSolicitar && <ArrowIcon />}</span>
          </button>
          {error && <p role="alert" className="alert">{error}</p>}
          <TurnoCard turno={turno} />
          {turno && (
            <button
              type="button"
              className="linkish"
              onClick={onActualizar}
              disabled={phase !== 'idle'}
            >
              {actualizando ? 'Actualizando estado...' : 'Actualizar estado'}
            </button>
          )}
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

function TurnoCard({ turno }) {
  const estado = turno?.estado
  const claseEstado = estado ? `status-${estado.toLowerCase()}` : 'status-vacio'
  const espera = formatearMinutos(turno?.esperaEstimadaMinutos)

  return (
    <article className="card" aria-labelledby="tu-turno">
      <div className="turno-row">
        <div className="ticket-badge">
          <TicketIcon />
        </div>
        <div className="turno-copy">
          <span id="tu-turno">Tu turno</span>
          <strong className={turno ? undefined : 'muted'}>{formatearNumero(turno?.numero)}</strong>
        </div>
        <span className={`status ${claseEstado}`}>{etiquetaEstado(estado)}</span>
      </div>
      <p className="hint">
        {mensajeTurno(turno)}
        {espera ? ` Espera estimada: ${espera}.` : ''}
      </p>
    </article>
  )
}

function mensajeTurno(turno) {
  if (!turno) return 'Aún no tienes un turno asignado.'
  if (turno.estado === 'PENDIENTE') return 'Consulta el estado de tu turno en esta pantalla.'
  if (turno.estado === 'ATENDIDO') return 'Este turno ya fue atendido.'
  return 'Revisa el estado recibido para este turno.'
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

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
