const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const isDemoMode = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

const demoTurns = [
  { number: 101, requestedAt: '2026-10-29T08:02:00', attendedAt: '2026-10-29T08:14:00', status: 'attended' },
  { number: 102, requestedAt: '2026-10-29T08:05:00', attendedAt: '2026-10-29T08:20:00', status: 'attended' },
  { number: 103, requestedAt: '2026-10-29T08:11:00', attendedAt: null, status: 'pending' },
  { number: 104, requestedAt: '2026-10-29T08:16:00', attendedAt: '2026-10-29T08:31:00', status: 'attended' },
  { number: 105, requestedAt: '2026-10-29T08:22:00', attendedAt: null, status: 'pending' },
  { number: 106, requestedAt: '2026-10-29T08:25:00', attendedAt: null, status: 'cancelled' },
  { number: 107, requestedAt: '2026-10-29T08:29:00', attendedAt: '2026-10-29T08:45:00', status: 'attended' },
  { number: 108, requestedAt: '2026-10-29T08:36:00', attendedAt: null, status: 'pending' },
  { number: 109, requestedAt: '2026-10-29T08:42:00', attendedAt: '2026-10-29T08:58:00', status: 'attended' },
  { number: 110, requestedAt: '2026-10-29T08:49:00', attendedAt: null, status: 'pending' },
  { number: 111, requestedAt: '2026-10-29T08:54:00', attendedAt: null, status: 'pending' },
]

let demoState = demoTurns.map((turn) => ({ ...turn }))

const labels = { pending: 'Pendiente', attended: 'Atendido', cancelled: 'Cancelado' }
function normalizeTurn(turn) {
  return {
    number: turn.number ?? turn.numero,
    requestedAt: turn.requestedAt ?? turn.hora_solicitud,
    attendedAt: turn.attendedAt ?? turn.hora_atencion,
    status: turn.status ?? turn.estado,
    statusLabel: labels[turn.status ?? turn.estado] || turn.estado || 'Sin estado',
  }
}

function getNext(turns) {
  return turns.find((turn) => turn.status === 'pending') || null
}

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) throw new Error(`El servidor respondió con el estado ${response.status}.`)
  return response.status === 204 ? null : response.json()
}

export async function getDashboardData() {
  if (isDemoMode) {
    const turns = demoState.map(normalizeTurn)
    return { turns, nextTurn: getNext(turns) }
  }
  const turns = (await request('/api/turnos')).map(normalizeTurn)
  const nextTurnResponse = await request('/api/turnos/siguiente')
  const nextTurn = nextTurnResponse ? normalizeTurn(nextTurnResponse) : null
  return { turns, nextTurn }
}

export async function callNextTurn() {
  if (isDemoMode) {
    const next = demoState.find((turn) => turn.status === 'pending')
    if (!next) throw new Error('No hay turnos pendientes.')
    next.status = 'attended'
    next.attendedAt = new Date().toISOString()
    return normalizeTurn(next)
  }
  return request('/api/turnos/llamar-siguiente', { method: 'POST' })
}
