# SystemTurn

Sistema de gestión de turnos con un backend en Spring Boot y una interfaz web en React.

## Estructura principal

- `backend/turnos-api`: API REST desarrollada con Java y Spring Boot.
- `frontend/frontend-react/react-client`: aplicación web desarrollada con React y Vite.

## Vista del asesor

La vista del asesor permite:

- Consultar los turnos registrados.
- Ver el siguiente turno pendiente.
- Llamar al siguiente turno.
- Consultar la hora de solicitud y atención.
- Buscar turnos por número.
- Filtrar turnos por estado.
- Mostrar estados de carga, error y fila vacía.

La interfaz está en:

```text
frontend/frontend-react/react-client/src/views/AsesorView.jsx
```

La comunicación con el backend está centralizada en:

```text
frontend/frontend-react/react-client/src/services/turnosService.js
```

## Tecnologías

- React
- Vite
- Java
- Spring Boot
- Maven

## Ejecutar el proyecto

### Backend

En una terminal:

```powershell
cd backend\turnos-api
.\mvnw.cmd spring-boot:run
```

El backend se ejecuta en:

```text
http://localhost:8080
```

### Frontend

En otra terminal:

```powershell
cd frontend\frontend-react\react-client
npm install
npm run dev
```

La aplicación se abre normalmente en:

```text
http://localhost:5173
```

## Comunicación entre frontend y backend

El frontend utiliza `fetch` para consumir estos endpoints:

```text
GET   /api/v1/turnos/dashboard
PATCH /api/v1/turnos/siguiente
```

Vite redirige las solicitudes que comienzan con `/api` hacia Spring Boot en el puerto `8080`.

El backend decide cuál es el siguiente turno. React muestra la información y actualiza la pantalla después de cada operación.

## Validación

Desde la carpeta del frontend se pueden ejecutar:

```powershell
npm run lint
npm run build
```

Estos comandos validan el código y comprueban que la aplicación pueda compilarse correctamente.
