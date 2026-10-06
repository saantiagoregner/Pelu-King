# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y MongoDB (Mongoose) para gestionar servicios y reservas de una peluquería. Los datos se guardan en MongoDB Atlas.

## Arquitectura en capas

El proyecto está organizado en capas, cada una con una única responsabilidad. Una request recorre este camino:

```
router → controller → service → repository → DAO → MongoDB (Mongoose)
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Router | `src/routes` | Define los endpoints y los conecta con su controller. No tiene lógica. |
| Controller | `src/controllers` | Lee `req` (`params`, `query`, `body`), llama al service y responde con `res.status().json()`. |
| Service | `src/services` | Contiene las reglas de negocio (validaciones, filtros, errores 404, incremento de `quantity`). No conoce `req` ni `res`. |
| Repository | `src/repositories` | Ofrece métodos de acceso a datos sin reglas de negocio. |
| DAO | `src/dao` | Accede directamente a la base de datos usando los modelos de Mongoose. Sin lógica de negocio. |
| Model | `src/models` | Define los esquemas de Mongoose de cada colección. |

La migración de FileSystem a MongoDB solo modificó la capa de persistencia (DAO y modelos): los endpoints y su comportamiento externo son los mismos.

## Modelos

- **Service** (`service.model.js`): `name`, `description`, `duration`, `price`, `category`, `available`.
- **Booking** (`booking.model.js`): `clientName`, `clientEmail`, `date`, `time`, `status` y `services: [{ service: ObjectId, quantity: Number }]`. Los servicios se guardan como referencia (`ObjectId`) al modelo `Service`, no como objeto completo.
- **Message** (`message.model.js`): `user`, `message` (con `createdAt` y `updatedAt`).

## Instalación

```bash
git clone https://github.com/saantiagoregner/Pelu-King.git
cd Pelu-King
npm install
```

Creá tu archivo `.env` en base al `.env.example` y completá tu `MONGO_URI`:

```bash
cp .env.example .env
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
| -------- | ----------- | ------- |
| `PORT` | Puerto en el que corre la aplicación | `8080` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `MONGO_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/peluking?retryWrites=true&w=majority` |

El archivo `.env` no se sube al repositorio.

## Ejecución

```bash
npm start       # producción
npm run dev     # modo desarrollo (reinicia al guardar)
```

El servidor corre en `http://localhost:8080` (o en el puerto definido en `PORT`) una vez conectado a MongoDB.

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
├── config/         env.config.js, db.config.js
├── controllers/    services.controller.js, bookings.controller.js
├── services/       services.service.js, bookings.service.js
├── repositories/   services.repository.js, bookings.repository.js
├── dao/            services.dao.js, bookings.dao.js
├── models/         service.model.js, booking.model.js, message.model.js
├── routes/         services.router.js, bookings.router.js
├── utils/          httpError.js, jsonOptions.js
├── app.js
└── server.js
```