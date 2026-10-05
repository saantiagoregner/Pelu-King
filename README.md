# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y FileSystem (persistencia en archivos JSON) para gestionar servicios y reservas de una peluquería.

## Instalación

```bash
git clone https://github.com/saantiagoregner/Pelu-King.git
cd Pelu-King
npm install
```

## Ejecución

```bash
npm start       # producción
npm run dev     # modo desarrollo (reinicia al guardar)
```

El servidor corre en `http://localhost:8080` (podés cambiar el puerto con la variable `PORT`).

## Endpoints

### Services

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/services` | Lista todos los servicios |
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
├── app.js
├── config/       env.config.js
├── data/         services.json, bookings.json
├── managers/     ServiceManager.js, BookingManager.js
├── routes/       services.router.js, bookings.router.js
└── utils/        httpError.js
```