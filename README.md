# PRMUSIC — Frontend

Interfaz para el usuario final de **PRMUSIC**, un cancionero colaborativo de acordes al estilo Cifra Club o LaCuerda: buscás una canción, la tocás con sus acordes, cambiás el tono, la guardás en favoritos y aportás canciones nuevas que un administrador modera.

Trabajo Práctico N.º 2 de **Programación IV**: integración de back-end y front-end.

| | |
|---|---|
| **Temática** | Cancionero de acordes y tablaturas (rock nacional y metal) |
| **Modalidad** | Individual |
| **Integrante** | _Completar con nombre y apellido_ |
| **Autor del back-end original** | El mismo integrante (TP N.º 1, aprobado) |
| **Framework del front-end** | React 19 + Vite |
| **Repositorio del back-end** | [velauti12/PRMUSIC](https://github.com/velauti12/PRMUSIC) (Ruby on Rails 8.1) |
| **Deploy** | No realizado (opcional según la consigna) |

---

## Funcionalidades

| Pantalla | Ruta | Acceso | Qué hace |
|---|---|---|---|
| Canciones | `/` | Público | Listado de canciones aprobadas con buscador (título o artista) y filtros por artista y género. Los filtros quedan en la URL. |
| Detalle de canción | `/songs/:id` | Público | Letra con acordes resaltados, portada del álbum, **cambio de tono** (lo calcula la API), tamaño de letra, autoscroll y botón de favoritos. |
| Iniciar sesión | `/login` | Anónimo | Login con usuario y contraseña; vuelve a la página desde la que se pidió. |
| Crear cuenta | `/register` | Anónimo | Registro con validación; inicia sesión automáticamente. |
| Aportar canción | `/songs/new` | Con sesión | Formulario con validación y vista previa. La canción queda **pendiente** hasta que un admin la apruebe en el back-office. |
| Mi perfil | `/profile` | Con sesión | Mis canciones con su estado (Pendiente / Aprobada / Rechazada) y mis favoritos, con opción de quitarlos. |
| Artistas / Géneros | `/artists`, `/genres` y sus detalles | Público | Exploración del catálogo y canciones de cada artista o género. |

**Experiencia de usuario (consigna §4.5):**
- Estados de **carga**, **sin resultados**, **error con botón "Reintentar"** y **confirmación** de operaciones con avisos (toasts).
- Formularios con validación en el cliente (mismas reglas que los modelos de Rails), errores por campo y **errores devueltos por la API**.
- Botones bloqueados mientras se envía una operación, para evitar envíos repetidos.
- Etiquetas en todos los campos, enlace "Saltar al contenido", foco visible, `aria-live` en avisos y errores; todo se puede usar con teclado.
- Diseño adaptable a pantallas chicas.

La administración (aprobar canciones, CRUD de artistas, álbumes con portada y géneros) **sigue en el back-office de Rails** (`/admin`), que es un contexto separado.

---

## Requisitos

| Herramienta | Versión usada |
|---|---|
| Node.js | 24.x |
| npm | 11.x |
| Ruby | 3.4.x |
| Rails | 8.1.x |
| SQLite | 3.x |

Librerías principales del front: React 19, React Router 7, axios, Zustand, Vite 8. Tests: Vitest + Testing Library + jsdom.

---

## Instalación y ejecución (ambos proyectos)

Clonar los dos repositorios en la misma carpeta:

```bash
git clone https://github.com/velauti12/PRMUSIC.git store
git clone https://github.com/velauti12/prmusic-frontend.git store-frontend
```

### 1. Back-end (Rails)

```bash
cd store
bundle install
bin/rails db:setup     # crea la base, corre las migraciones y carga los datos de prueba
bin/rails server       # http://localhost:3000
```

Para volver a los datos de prueba en cualquier momento: `bin/rails db:seed` (borra y recrea todo).

Variables de entorno opcionales del back-end:

| Variable | Para qué | Valor por defecto |
|---|---|---|
| `FRONTEND_URL` | Orígenes permitidos por CORS (varios separados por coma) | `http://localhost:5173` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Credenciales del back-office | `admin` / `admin` |

### 2. Front-end (este repositorio)

```bash
cd store-frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

`.env.example`:

```
VITE_API_URL=
```

- **Vacío (recomendado en desarrollo):** Vite redirige `/api` a `http://localhost:3000` (ver `vite.config.js`).
- **Con valor:** URL del back-end, por ejemplo `http://localhost:3000` o la URL pública si se hace deploy. En ese caso el back-end tiene que permitir el origen del front en `FRONTEND_URL`.

---

## Datos de prueba y credenciales de demostración

Los carga `bin/rails db:seed`. Son cuentas ficticias, solo para desarrollo.

| Contexto | Usuario | Contraseña |
|---|---|---|
| Front (usuario final) | `bauti`, `elmejor512`, `luisperez576`, `carlosalberto12` | `password123` |
| Back-office (`http://localhost:3000/admin`) | `admin` | `admin` |

También se puede crear un usuario nuevo desde `/register`. Los usuarios creados por la API siempre tienen rol `user`.

Datos incluidos: 5 artistas, 4 géneros, 2 álbumes (sin portada: se sube desde `/admin/albums`), 3 canciones aprobadas, 1 pendiente de moderación y 1 favorito de `bauti`.

---

## Pruebas y calidad

### Front-end

```bash
npm test            # Vitest: login (ok, 401 y validación) y alta de canciones (validación, envío y 422)
npm run lint        # oxlint
npm run build       # compilación de producción en dist/
```

Los tests simulan la API con `vi.mock` (lo permite la consigna §5.2); la demostración se hace contra la API real.

### Back-end (en `store`)

```bash
bin/rails test                # modelos, mailer e integración de la API y del back-office
bundle exec rubocop           # sin ofensas
bundle exec brakeman          # sin advertencias
```

**Advertencias conocidas:** en Windows, git muestra avisos `LF will be replaced by CRLF` al commitear; son por los finales de línea y no afectan al código. Si la carpeta está en OneDrive y alguna página queda en blanco durante el desarrollo, reiniciar `npm run dev` (el observador de archivos de Vite a veces no detecta cambios ahí).

---

## Integración con la API

- URL base: `/api/v1`, formato JSON.
- Autenticación: `POST /login` devuelve un token; el front lo guarda en `localStorage` y lo envía como `Authorization: Bearer <token>`. `DELETE /logout` lo invalida.
- Si una petición con sesión responde `401`, el front cierra la sesión y lleva al login.
- Errores: `{ "error": "..." }` (400, 401, 403, 404) o `{ "errors": ["..."] }` (422).

Endpoints usados por el front:

| Uso | Endpoint |
|---|---|
| Sesión | `POST /login`, `DELETE /logout`, `POST /users` |
| Canciones | `GET /songs?q=&artist_id=&genre_id=`, `GET /songs/:id`, `GET /songs/mine`, `POST /songs` |
| Transposición | `GET /songs/:id/transpose?semitones=N` |
| Catálogo | `GET /artists`, `GET /artists/:id`, `GET /genres`, `GET /genres/:id` |
| Favoritos | `GET /favorites`, `POST /favorites`, `DELETE /favorites/:id` |

El detalle de cada endpoint (parámetros, permisos y errores) está en el [README del back-end](https://github.com/velauti12/PRMUSIC#api-restful-apiv1). Los cambios hechos al back-end para este trabajo (correcciones del TP 1, adaptaciones para la integración y ampliaciones) están separados en sus commits.

---

## Estructura

```
src/
├── components/   # Navbar, SongCard, ChordSheet, FavoriteButton, estados (Spinner, EmptyState, ErrorMessage, Toaster)...
├── pages/        # Una página por ruta
├── services/     # Llamadas a la API (axios con interceptores de token y 401)
├── store/        # Sesión y avisos (Zustand)
├── hooks/        # useFetch (carga/error/reintento) y useDebounce
├── utils/        # Mensajes de error legibles
└── test/         # Tests con Vitest + Testing Library
```

---

## Demostración sugerida

1. Iniciar sesión con `bauti` / `password123`.
2. Buscar "muchacha", abrir la canción, subir el tono y agregarla a favoritos.
3. Aportar una canción nueva y verla en **Mi perfil** como _Pendiente_.
4. En `/admin` aprobarla y verla en el listado público.
5. En `/admin/albums` subir la portada de "Almendra" y verla en el detalle de la canción.
6. Errores: login con contraseña incorrecta y formulario de canción con un tono inválido.
