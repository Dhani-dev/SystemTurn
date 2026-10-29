// Contrato previsto con Spring Boot. Confirmar rutas y campos con el responsable.
// POST   /api/turnos                         -> { numero, estado, posicionEnFila?, esperaEstimadaMinutos? }
// GET    /api/turnos/{numero}                -> mismo objeto
// POST   /api/turnos/{numero}/cancelar       -> mismo objeto, estado CANCELADO
// GET    /api/turnos/estadisticas            -> { personasEnEspera, tiempoEsperaPromedioMinutos, turnosAtendidosHoy }
// Mientras VITE_USE_TURNOS_SIMULATION no sea "false", estas llamadas no salen del navegador.

import {
  simularCancelarTurno,
  simularConsultarTurno,
  simularEstadisticas,
  simularSolicitarTurno,
} from './turnosSimulation.js'

const SIMULACION = import.meta.env.VITE_USE_TURNOS_SIMULATION !== 'false'

export function usandoSimulacion() {
  return SIMULACION
}

function baseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
}

function numeroONull(value) {
  if (value === null || value === undefined || value === '') return null
  const numero = Number(value)
  return Number.isFinite(numero) ? numero : null
}

function normalizarTurno(data) {
  const numero = data?.numero ?? data?.numeroTurno ?? data?.id
  const estado = data?.estado
  if (numero === undefined || numero === null || estado === undefined || estado === null || estado === '') {
    throw new Error('La respuesta del servidor no trae el número o el estado del turno.')
  }

  return {
    numero,
    estado: String(estado).trim().toUpperCase(),
    posicionEnFila: numeroONull(data.posicionEnFila ?? data.posicion),
    esperaEstimadaMinutos: numeroONull(data.esperaEstimadaMinutos ?? data.esperaEstimada),
  }
}

function normalizarEstadisticas(data) {
  if (!data || typeof data !== 'object') return null
  return {
    personasEnEspera: numeroONull(data.personasEnEspera ?? data.pendientes),
    tiempoEsperaPromedioMinutos: numeroONull(
      data.tiempoEsperaPromedioMinutos ?? data.esperaPromedioMinutos,
    ),
    turnosAtendidosHoy: numeroONull(data.turnosAtendidosHoy ?? data.atendidosHoy),
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new Error('No pudimos conectar con el servidor. La solicitud no se repitió.')
  }

  if (!response.ok) {
    throw new Error('No se pudo completar la operación. Inténtalo de nuevo.')
  }

  if (response.status === 204) return null
  try {
    return await response.json()
  } catch {
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }
}

export async function solicitarTurno() {
  if (SIMULACION) return normalizarTurno(await simularSolicitarTurno())
  return normalizarTurno(
    await request('/api/turnos', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  )
}

export async function cancelarTurno(numero) {
  if (SIMULACION) return normalizarTurno(await simularCancelarTurno(numero))
  return normalizarTurno(
    await request(`/api/turnos/${encodeURIComponent(numero)}/cancelar`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  )
}

export async function consultarTurno(numero) {
  if (SIMULACION) return normalizarTurno(await simularConsultarTurno(numero))
  return normalizarTurno(await request(`/api/turnos/${encodeURIComponent(numero)}`))
}

export async function obtenerEstadisticas() {
  if (SIMULACION) return normalizarEstadisticas(await simularEstadisticas())
  try {
    return normalizarEstadisticas(await request('/api/turnos/estadisticas'))
  } catch {
    return null
  }
}
