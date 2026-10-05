# Peluking - API de Turnos y Reservas

API REST hecha con Node.js, Express y FileSystem (persistencia en archivos JSON) para gestionar servicios y reservas de una peluquería.

## Arquitectura en capas

El proyecto está organizado en capas, cada una con una única responsabilidad. Una request recorre este camino:

```
router → controller → service → repository → DAO → archivo JSON
```

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Router | `src/routes` | Define los endpoints y los conecta con su controller. No tiene lógica. |
| Controller | `src/controllers` | Lee `req` (`params`, `query`, `body`), llama al service y responde con `res.status().json()`. |
| Service | `src/services` | Contiene las reglas de negocio (validaciones, filtros, errores 404, incremento de `quantity`). No conoce `req` ni `res`. |
| Repository | `src/repositories` | Ofrece métodos de acceso a datos (`getAll`, `getById`, `create`, `update`, `delete`) sin reglas de negocio. |
| DAO | `src/dao` | Lee y escribe directamente los archivos JSON. No tiene lógica de negocio. |

Reglas que respeta el proyecto:

- `req` y `res` solo se usan en los controllers.
- Solo los DAO acceden a los archivos JSON.
- Las reglas de negocio viven solo en los services. Por ejemplo, si un mismo servicio se agrega dos veces a una reserva, `bookings.service.js` incrementa `quantity`.
- El repository separa al service de la forma de persistencia: si más adelante se cambia el JSON por una base de datos (por ejemplo MongoDB), solo cambian el DAO y el repository.

### Ejemplo de flujo: `POST /api/bookings/:bid/services/:sid`

1. **Router**: conecta la ruta con `addServiceToBooking` del controller.
2. **Controller**: toma `bid` y `sid` de `req.params` y llama a `bookingsService.addServiceToBooking`.
3. **Service**: verifica que el servicio exista (usando `servicesService`), busca la reserva y suma `quantity` si el servicio ya estaba.
4. **Repository**: `update` de la reserva.
5. **DAO**: escribe el cambio en `bookings.json`.
6. **Controller**: responde con `res.status(200).json(...)`.

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
├── config/         env.config.js
├── controllers/    services.controller.js, bookings.controller.js
├── services/       services.service.js, bookings.service.js
├── repositories/   services.repository.js, bookings.repository.js
├── dao/            services.dao.js, bookings.dao.js
├── routes/         services.router.js, bookings.router.js
├── data/           services.json, bookings.json
├── utils/          httpError.js
├── app.js
└── server.js
```