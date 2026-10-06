# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y MongoDB (Mongoose) para gestionar servicios y reservas de una peluquería. Incluye vistas renderizadas en el servidor con Handlebars y actualizaciones en tiempo real con Socket.io. Los datos se guardan en MongoDB Atlas.

## Arquitectura en capas

El proyecto está organizado en capas, cada una con una única responsabilidad. Una request recorre este camino:

```
router → middleware de validación (Zod) → controller → service → repository → DAO → MongoDB (Mongoose)
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Router | `src/routes` | Define los endpoints, aplica el middleware de validación y los conecta con su controller. No tiene lógica de filtros ni de validación. |
| Middleware | `src/middlewares` | `validate.middleware.js`: valida `body`, `params` y `query` con los esquemas de Zod y corta con `400` antes de llegar al controller. |
| Schemas | `src/schemas` | Esquemas de Zod de servicios y reservas (reglas de cada dato y mensajes de error). |
| Controller | `src/controllers` | Lee `req` (`params`, `query`, `body`), llama al service y responde con `res` (JSON o vista). |
| Service | `src/services` | Contiene las reglas de negocio (armado de filtros, orden y paginación, errores 404, incremento de `quantity`). No conoce `req` ni `res`. |
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
| GET | `/api/services` | Lista los servicios con filtros, ordenamiento y paginación |
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

#### Consultas avanzadas en `GET /api/services`

| Query param | Valores | Por defecto | Descripción |
|-------------|---------|-------------|-------------|
| `category` | texto (no distingue mayúsculas) | - | Devuelve solo los servicios de esa categoría |
| `available` | `true` o `false` | - | Devuelve solo los servicios disponibles o no disponibles |
| `page` | entero >= 1 | `1` | Página a devolver |
| `limit` | entero entre 1 y 50 | `10` | Cantidad de servicios por página |
| `sortBy` | `name`, `price`, `duration`, `category` | `_id` (orden de creación) | Campo por el que se ordena |
| `order` | `asc` o `desc` | `asc` | Sentido del orden |

Ejemplos:

```
GET /api/services?category=cabello
GET /api/services?available=true
GET /api/services?category=cabello&available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
GET /api/services?category=cabello&available=true&sortBy=price&order=asc&page=1&limit=5
```

Todos los parámetros se pueden combinar. Si alguno tiene un valor inválido (por ejemplo `page=0`, `limit=500`, `sortBy=color` o `available=maybe`), la API responde `400` con un mensaje claro.

Respuesta de ejemplo de `GET /api/services?sortBy=price&order=desc&page=1&limit=2`:

```json
{
  "status": "success",
  "payload": [
    { "id": "665f...a1", "name": "Tintura", "description": "Color completo", "duration": 90, "price": 25000, "category": "cabello", "available": true },
    { "id": "665f...b2", "name": "Corte de pelo", "description": "Corte clásico con lavado", "duration": 30, "price": 8000, "category": "cabello", "available": true }
  ],
  "total": 7,
  "page": 1,
  "limit": 2,
  "totalPages": 4,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

| Campo | Descripción |
|-------|-------------|
| `total` | Total de servicios que cumplen los filtros (en todas las páginas) |
| `page` | Página actual |
| `limit` | Servicios por página |
| `totalPages` | Total de páginas |
| `hasPrevPage` / `hasNextPage` | Si existe una página anterior / siguiente |
| `prevPage` / `nextPage` | Número de la página anterior / siguiente (`null` si no existe) |

## Validaciones

Las validaciones se hacen con [Zod](https://zod.dev) en `src/schemas` y se aplican con el middleware `validate` (`src/middlewares/validate.middleware.js`) directamente en los routers. Si los datos son inválidos, la API responde `400` con un mensaje claro y la request **no llega** al controller ni a MongoDB. Los esquemas de Mongoose quedan como una segunda red de seguridad, no como la validación principal.

| Endpoint | Qué se valida |
|----------|---------------|
| `GET /api/services` | Query params `category`, `available`, `page`, `limit`, `sortBy` y `order` |
| `POST /api/services` | `name`, `description`, `category` (texto no vacío), `duration` (número > 0), `price` (número >= 0), `available` (boolean) |
| `PUT /api/services/:sid` | Los mismos campos que al crear (el PUT reemplaza todos los datos) |
| `POST /api/bookings` | `clientName` (texto no vacío), `clientEmail` (email), `date` (`YYYY-MM-DD` y fecha real), `time` (`HH:MM` 24hs), `status` (opcional: `pending`, `confirmed`, `cancelled`) |
| `POST /api/bookings/:bid/services/:sid` | `bid` y `sid` deben ser ids válidos de MongoDB; `quantity` es opcional (entero >= 1, por defecto `1`) |

Los campos que no forman parte del esquema se descartan. Ejemplo de error:

```
POST /api/services   { "name": " ", "price": -5 }
```

```json
{
  "status": "error",
  "message": "name no puede estar vacío; description es obligatorio y debe ser un string; duration debe ser un número (minutos); price debe ser un número mayor o igual a 0; category es obligatorio y debe ser un string; available debe ser true o false"
}
```

### Bookings

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/bookings` | Crea una reserva (con `services` vacío) |
| GET | `/api/bookings/:bid` | Devuelve una reserva por id con los datos completos de sus servicios (`populate`) |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva (si ya estaba, suma `quantity`; sin body suma `1`) |

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

#### Reservas con servicios completos (`populate`)

En la base de datos, la reserva guarda solo referencias a los servicios (`{ service: ObjectId, quantity: Number }`). Al consultarla con `GET /api/bookings/:bid`, el DAO usa `populate("services.service")` y la respuesta incluye los datos completos de cada servicio. El `populate` se usa únicamente para consultar: nunca se guarda el servicio completo dentro de la reserva.

Pasos para probarlo:

1. Crear un servicio: `POST /api/services` y copiar su `id`.
2. Crear una reserva: `POST /api/bookings` y copiar su `id`.
3. Agregar el servicio: `POST /api/bookings/<bid>/services/<sid>` (opcional, body `{ "quantity": 2 }`).
4. Consultar: `GET /api/bookings/<bid>`

Respuesta de ejemplo:

```json
{
  "status": "success",
  "payload": {
    "id": "6650...c3",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@mail.com",
    "date": "2026-10-15",
    "time": "16:30",
    "status": "pending",
    "services": [
      {
        "service": {
          "id": "665f...b2",
          "name": "Corte de pelo",
          "description": "Corte clásico con lavado",
          "duration": 30,
          "price": 8000,
          "category": "cabello",
          "available": true
        },
        "quantity": 2
      }
    ]
  }
}
```

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
├── schemas/        common.schema.js, service.schema.js, booking.schema.js
├── middlewares/    validate.middleware.js
├── routes/         services.router.js, bookings.router.js, views.router.js
├── views/          layouts/main.handlebars, partials/serviceCard.handlebars,
│                   services.handlebars, availability.handlebars
├── public/         css/styles.css, js/socket.js
├── utils/          httpError.js, jsonOptions.js, emitEvent.js, escapeRegex.js
├── app.js
└── server.js
```