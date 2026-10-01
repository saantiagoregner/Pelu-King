# Peluking Backend 💈

API REST con **Express** para **Peluking**, una peluquería que necesita un sistema para gestionar sus servicios dentro de una futura plataforma de turnos y reservas.

Este proyecto corresponde a la segunda pre-entrega del curso **Programación Backend I: Desarrollo Avanzado de Backend**. Expone endpoints para gestionar el recurso `services`, conectados con la clase `ServiceManager` de la entrega anterior.

## 📁 Estructura del proyecto

```
peluking-backend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── routes/
│   │   └── services.router.js
│   ├── data/
│   │   └── services.json
│   ├── app.js
│   └── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Instalación

1. Cloná el repositorio:

```
git clone <URL_DEL_REPO>
cd peluking-backend
```

2. Instalá las dependencias:

```
npm install
```

3. Creá tu archivo `.env` en base al `.env.example`:

```
cp .env.example .env
```

## ▶️ Cómo ejecutar

```
npm start
```

Modo watch (reinicia automáticamente al guardar cambios):

```
npm run dev
```

El servidor queda escuchando en `http://localhost:<PORT>`.

## 🔑 Variables de entorno

| Variable   | Descripción                           | Ejemplo       |
| ---------- | ------------------------------------- | ------------- |
| `PORT`     | Puerto en el que corre la aplicación  | `8080`        |
| `NODE_ENV` | Entorno de ejecución de la aplicación | `development` |

Si falta alguna variable requerida, la aplicación no inicia y muestra un mensaje de error indicando cuál falta.

## 💇 Recurso: `services`

```json
{
  "id": 1,
  "name": "Corte de cabello clásico",
  "description": "Corte de cabello personalizado según el estilo del cliente",
  "duration": 30,
  "price": 9500,
  "category": "corte",
  "available": true
}
```

| Campo         | Tipo    | Descripción                                       |
| ------------- | ------- | ------------------------------------------------- |
| `id`          | number  | Identificador único, generado automáticamente     |
| `name`        | string  | Nombre del servicio                               |
| `description` | string  | Descripción del servicio                          |
| `duration`    | number  | Duración estimada en minutos                      |
| `price`       | number  | Precio del servicio                               |
| `category`    | string  | Categoría (corte, color, peinado, tratamiento...) |
| `available`   | boolean | Si el servicio está disponible para reservar      |

## 🌐 Endpoints

| Método   | Ruta                 | Descripción                                   | Códigos       |
| -------- | -------------------- | --------------------------------------------- | ------------- |
| `GET`    | `/api/services`      | Lista los servicios (acepta filtros)          | 200, 400      |
| `GET`    | `/api/services/:sid` | Devuelve un servicio por id                   | 200, 404      |
| `POST`   | `/api/services`      | Crea un servicio                              | 201, 400      |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio (el `id` no se modifica)| 200, 400, 404 |
| `DELETE` | `/api/services/:sid` | Elimina un servicio                           | 200, 404      |

Las respuestas tienen el formato `{ "status": "success", "payload": ... }` o `{ "status": "error", "message": "..." }`.

### `GET /api/services`

Devuelve todos los servicios. Filtros opcionales por query params:

- `category`: filtra por categoría. Ejemplo: `/api/services?category=tratamiento`
- `available`: `true` o `false`. Ejemplo: `/api/services?available=true`

Se pueden combinar: `/api/services?category=tratamiento&available=true`

### `GET /api/services/:sid`

Devuelve el servicio con ese id. Responde `404` si no existe.

### `POST /api/services`

Crea un servicio. El `id` se genera automáticamente, **no** hay que enviarlo. Responde `201` con el servicio creado, o `400` si faltan campos.

```json
{
  "name": "Alisado con keratina",
  "description": "Tratamiento de alisado progresivo con keratina",
  "duration": 120,
  "price": 15000,
  "category": "tratamiento",
  "available": true
}
```

### `PUT /api/services/:sid`

Actualiza los campos enviados en el body. El `id` se ignora si viene en el body. Responde `404` si el servicio no existe, y `400` si el body está vacío.

```json
{
  "price": 13000,
  "available": false
}
```

### `DELETE /api/services/:sid`

Elimina el servicio. Responde `404` si no existe.

## 🛠️ Tecnologías

- Node.js con módulos ES (ESM)
- [Express](https://expressjs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

## 👤 Autor

Santiago