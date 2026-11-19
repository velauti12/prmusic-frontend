# PRMUSIC - Frontend

Frontend de PRMUSIC, un cancionero de acordes tipo Cifra Club / LaCuerda. Se pueden buscar canciones, verlas con los acordes, cambiarles el tono, guardarlas en favoritos y subir canciones nuevas (que después aprueba un admin desde el back-office).

TP2 de Programación IV. Trabajo individual.

- Integrante: Bautista Velasco
- Backend: es el mismo que hice en el TP1, en Rails → [velauti12/PRMUSIC](https://github.com/velauti12/PRMUSIC)
- Frontend: React + Vite

## Pantallas

- `/` → listado de canciones con buscador y filtros por artista y género
- `/songs/:id` → la canción con los acordes, cambio de tono, tamaño de letra, autoscroll y favoritos
- `/login` y `/register`
- `/songs/new` → subir una canción (hay que estar logueado). Queda pendiente hasta que la aprueben
- `/profile` → mis canciones (con su estado) y mis favoritos
- `/artists` y `/genres` → listados y detalle con sus canciones

La parte de administración sigue estando en el back-office de Rails (`/admin`).

## Versiones

Node 24, npm 11, Ruby 3.4, Rails 8.1, SQLite 3.
En el front uso React 19, React Router, axios y Zustand. Los tests son con Vitest y Testing Library.

## Cómo correrlo

Hay que tener los dos repos clonados:

```bash
git clone https://github.com/velauti12/PRMUSIC.git store
git clone https://github.com/velauti12/prmusic-frontend.git store-frontend
```

**Backend**

```bash
cd store
bundle install
bin/rails db:setup
bin/rails server
```

Queda en http://localhost:3000. Si quieren volver a los datos de prueba: `bin/rails db:seed`.

Variables opcionales: `FRONTEND_URL` (para CORS, por defecto `http://localhost:5173`) y `ADMIN_USERNAME` / `ADMIN_PASSWORD` para el back-office (por defecto `admin` / `admin`).

**Frontend**

```bash
cd store-frontend
npm install
cp .env.example .env
npm run dev
```

Queda en http://localhost:5173.

En el `.env` está `VITE_API_URL`. Si se deja vacío, Vite manda las llamadas a `/api` al backend en el puerto 3000. Si se pone una URL, va directo a esa.

## Usuarios de prueba

Los crea el seed:

- Usuarios normales: `bauti`, `elmejor512`, `luisperez576`, `carlosalberto12` → contraseña `password123`
- Back-office: `admin` / `admin` en http://localhost:3000/admin

También se puede crear un usuario desde `/register`.

## Tests y chequeos

Front:

```bash
npm test
npm run lint
npm run build
```

Back (dentro de `store`):

```bash
bin/rails test
bundle exec rubocop
bundle exec brakeman
```

En los tests del front la API está mockeada. Probé login (bien y con contraseña incorrecta) y el formulario para subir canciones.

## API

El front usa la API en `/api/v1`. Al loguearse se guarda el token y se manda en cada request como `Authorization: Bearer <token>`. Si el token deja de servir, se cierra la sesión y te manda al login.

Los endpoints que uso:

- `POST /login`, `DELETE /logout`, `POST /users`
- `GET /songs`, `GET /songs/:id`, `GET /songs/mine`, `POST /songs`
- `GET /songs/:id/transpose?semitones=N`
- `GET /artists`, `GET /artists/:id`, `GET /genres`, `GET /genres/:id`
- `GET /favorites`, `POST /favorites`, `DELETE /favorites/:id`

Más detalle de cada uno en el README del backend.

## Estructura

```
src/
├── components/
├── pages/
├── services/   llamadas a la API
├── store/      sesión y notificaciones
├── hooks/
├── utils/
└── test/
```
