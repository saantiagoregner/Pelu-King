# Peluking Backend 💈

Backend para **Peluking**, una peluquería que necesita un sistema para gestionar sus servicios dentro de una futura plataforma de turnos y reservas.

Este proyecto es la pre-entrega del curso **Programación Backend I: Desarrollo Avanzado de Backend**, y su objetivo es implementar una clase `ServiceManager` que permita crear, leer, actualizar y eliminar los servicios que ofrece la peluquería (cortes, coloración, peinados, tratamientos, etc.).

## 📁 Estructura del proyecto

```
peluking-backend/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── data/
│   │   └── services.json
│   └── app.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Instalación

1. Cloná el repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd peluking-backend
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Creá tu archivo `.env` en base al `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Y completá los valores (ver sección de variables de entorno).

## ▶️ Cómo ejecutar

```bash
npm start
```

Esto corre `src/app.js`, que muestra por consola una demo de uso de todos los métodos de `ServiceManager` (obtener, buscar, agregar, actualizar y eliminar servicios).

También podés usar el modo watch (reinicia automáticamente al guardar cambios):

```bash
npm run dev
```

## 🔑 Variables de entorno

| Variable   | Descripción                                | Ejemplo     |
|------------|---------------------------------------------|-------------|
| `PORT`     | Puerto en el que corre la aplicación         | `8080`      |
| `NODE_ENV` | Entorno de ejecución de la aplicación        | `development` |

Si falta alguna variable requerida, la aplicación no inicia y muestra un mensaje de error indicando cuál falta.

## 💇 Recurso: `services`

Cada servicio de la peluquería tiene la siguiente forma:

```json
{
  "id": 1,
  "name": "Corte de cabello clásico",
  "description": "Corte de cabello personalizado según el estilo del cliente",
  "duration": 30,
  "price": 4500,
  "category": "corte",
  "available": true
}
```

| Campo         | Tipo    | Descripción                                      |
|---------------|---------|---------------------------------------------------|
| `id`          | number  | Identificador único, generado automáticamente     |
| `name`        | string  | Nombre del servicio                               |
| `description` | string  | Descripción del servicio                          |
| `duration`    | number  | Duración estimada en minutos                      |
| `price`       | number  | Precio del servicio                               |
| `category`    | string  | Categoría (corte, color, peinado, tratamiento...) |
| `available`   | boolean | Si el servicio está disponible para reservar       |

## 🧩 Métodos de `ServiceManager`

Todos los métodos son asíncronos y devuelven una `Promise`.

### `getServices()`
Devuelve un array con todos los servicios.

```js
const services = await serviceManager.getServices();
```

### `getServiceById(id)`
Busca un servicio por su id. Si no existe, devuelve un objeto con `error`.

```js
const service = await serviceManager.getServiceById(1);
```

### `addService(serviceData)`
Agrega un nuevo servicio. El `id` se genera internamente, **no** se recibe como parámetro. Valida que estén presentes `name`, `description`, `duration`, `price`, `category` y `available`; si falta alguno, devuelve un objeto con `error` y no agrega el servicio.

```js
const newService = await serviceManager.addService({
  name: "Alisado con keratina",
  description: "Tratamiento de alisado progresivo con keratina",
  duration: 120,
  price: 15000,
  category: "tratamiento",
  available: true,
});
```

### `updateService(id, updatedData)`
Actualiza los campos indicados de un servicio existente. No permite modificar el `id` (si se envía, se ignora). Devuelve un objeto con `error` si el servicio no existe.

```js
const updated = await serviceManager.updateService(2, {
  price: 13000,
  available: false,
});
```

### `deleteService(id)`
Elimina un servicio por su id. Devuelve un objeto con `error` si no existe.

```js
const result = await serviceManager.deleteService(5);
```

## 🛠️ Tecnologías

- Node.js con módulos ES (ESM)
- [dotenv](https://www.npmjs.com/package/dotenv) para variables de entorno

## 👤 Autor

Santiago
