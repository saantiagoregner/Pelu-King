# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y FileSystem (persistencia en archivos JSON) para gestionar servicios y reservas de una peluquería.

La API está organizada en tres capas:

- **Routers**: definen los endpoints y los conectan con su controller (no tienen lógica).
- **Controllers**: leen `req.params`, `req.query` y `req.body`, llaman al manager y responden con `res.status().json()`.
- **Managers**: manejan la lógica de datos y la persistencia en los archivos JSON (no usan `req` ni `res`).

## Instalación

```bash
git clone https://github.com/saantiagoregner/Pelu-King.git
cd Pelu-King
npm install
```

Creá tu archivo `.env` en base al `.env.example`:

```bash
cp .env.example .env
```

## Ejecución

```bash
npm start       # producción
npm run dev     # modo desarrollo (reinicia al guardar)
```

El servidor corre en `http://localhost:8080` (o en el puerto definido en `PORT`).

## Variables de entorno

| Variable   | Descripción                          | Ejemplo       |
| ---------- | ------------------------------------ | ------------- |
| `PORT`     | Puerto en el que corre la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución                 | `development` |

## Endpoints

### Services

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/services` | Lista los servicios (admite filtros por query params) |
| GET | `/api/services/:sid` | Devuelve un servicio por id |
| POST | `/api/services` | Crea un servicio |
| PUT | `/api/services/:sid` | Actualiza un servicio (el id no se modifica) |
| DELETE | `/api/services/:sid` | Elimina un servicio |

Body de ejemplo (POST/PUT):

```json
{
  "name": "Corte de pelo",
  "description": "Corte clásico con lavado",
  "duration": 30,
  "price": 8000,
  "category": "cabello",
  "available": true
}
```

#### Filtros en `GET /api/services`

| Query param | Valores | Descripción |
|-------------|---------|-------------|
| `category` | texto (no distingue mayúsculas) | Devuelve solo los servicios de esa categoría |
| `available` | `true` o `false` | Devuelve solo los servicios disponibles o no disponibles |

Ejemplos:

```
GET /api/services?category=cabello
GET /api/services?available=true
GET /api/services?available=false
GET /api/services?category=cabello&available=true
```

Los filtros se pueden combinar. Si `available` tiene un valor distinto de `true` o `false`, o si `category` viene vacío, la API responde `400`.

### Bookings

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/bookings` | Crea una reserva (con `services` vacío) |
| GET | `/api/bookings/:bid` | Devuelve una reserva por id |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva (si ya estaba, suma `quantity`) |

Body de ejemplo (POST /api/bookings):

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@mail.com",
  "date": "2026-10-15",
  "time": "16:30",
  "status": "pending"
}
```

`status` es opcional (por defecto `pending`). Valores válidos: `pending`, `confirmed`, `cancelled`.

## Estructura

```
src/
├── config/        env.config.js
├── controllers/   services.controller.js, bookings.controller.js
├── managers/      ServiceManager.js, BookingManager.js
├── routes/        services.router.js, bookings.router.js
├── data/          services.json, bookings.json
├── utils/         httpError.js
├── app.js
└── server.js
```