# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y MongoDB (Mongoose) para gestionar servicios y reservas de una peluquería. Incluye vistas renderizadas en el servidor con Handlebars y actualizaciones en tiempo real con Socket.io. Los datos se guardan en MongoDB Atlas.

## Arquitectura en capas

El proyecto está organizado en capas, cada una con una única responsabilidad. Una request recorre este camino:

```
router → controller → service → repository → DAO → MongoDB (Mongoose)
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Router | `src/routes` | Define los endpoints y los conecta con su controller. No tiene lógica. |
| Controller | `src/controllers` | Lee `req` (`params`, `query`, `body`), llama al service y responde con `res` (JSON o vista). |
| Service | `src/services` | Contiene las reglas de negocio (validaciones, filtros, errores 404, incremento de `quantity`). No conoce `req` ni `res`. |
| Repository | `src/repositories` | Ofrece métodos de acceso a datos sin reglas de negocio. |
| DAO | `src/dao` | Accede directamente a la base de datos usando los modelos de Mongoose. Sin lógica de negocio. |
| Model | `src/models` | Define los esquemas de Mongoose de cada colección. |

Los controllers de vistas (`views.controller.js`) usan las mismas capas que los de la API: no tienen lógica de negocio ni acceden a la base de datos directamente.

## Vistas con Handlebars

Las vistas se renderizan en el servidor con [express-handlebars](https://www.npmjs.com/package/express-handlebars) y muestran datos reales de MongoDB (no hay datos escritos a mano en las plantillas).

| Ruta | Descripción |
|------|-------------|
| `GET /views/services` | Listado de servicios: nombre, descripción, duración, precio, categoría y disponibilidad |
| `GET /views/availability` | Disponibilidad: servicios separados en "Disponibles" y "No disponibles" |

Estructura de las vistas:

- `src/views/layouts/main.handlebars`: layout principal (navegación, estilos y scripts)
- `src/views/partials/serviceCard.handlebars`: tarjeta de un servicio, reutilizada en ambas vistas
- `src/views/services.handlebars` y `src/views/availability.handlebars`
- `src/public/css/styles.css` y `src/public/js/socket.js`: archivos estáticos

## Tiempo real con Socket.io

Socket.io se configura en `src/config/socket.config.js` y se inicia desde `src/server.js`. Los controllers de la API emiten un evento cuando una acción se completa con éxito, y `public/js/socket.js` actualiza la vista abierta sin recargar la página.

| Evento | Se emite cuando | Qué hace la vista |
|--------|-----------------|-------------------|
| `service:created` | `POST /api/services` | Agrega la tarjeta y actualiza el contador |
| `service:updated` | `PUT /api/services/:sid` | Actualiza la tarjeta (y en disponibilidad la mueve de columna si cambia `available`) |
| `service:deleted` | `DELETE /api/services/:sid` | Quita la tarjeta |

Para probarlo: abrí `http://localhost:8080/views/services` (o `/views/availability`) en el navegador y, con Postman o Thunder Client, creá, editá o eliminá un servicio con la API. La vista se actualiza al instante.

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

## Endpoints de la API REST

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

## Modelos

- **Service** (`service.model.js`): `name`, `description`, `duration`, `price`, `category`, `available`.
- **Booking** (`booking.model.js`): `clientName`, `clientEmail`, `date`, `time`, `status` y `services: [{ service: ObjectId, quantity: Number }]`.
- **Message** (`message.model.js`): `user`, `message` (con `createdAt` y `updatedAt`).

## Estructura

```
src/
├── config/         env.config.js, db.config.js, handlebars.config.js, socket.config.js
├── controllers/    services.controller.js, bookings.controller.js, views.controller.js
├── services/       services.service.js, bookings.service.js
├── repositories/   services.repository.js, bookings.repository.js
├── dao/            services.dao.js, bookings.dao.js
├── models/         service.model.js, booking.model.js, message.model.js
├── routes/         services.router.js, bookings.router.js, views.router.js
├── views/          layouts/main.handlebars, partials/serviceCard.handlebars,
│                   services.handlebars, availability.handlebars
├── public/         css/styles.css, js/socket.js
├── utils/          httpError.js, jsonOptions.js, emitEvent.js
├── app.js
└── server.js
```