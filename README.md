# Planok - Sistema de Gestion de Tareas (Frontend)

Este proyecto es una aplicacion de Frontend construida con React, Vite y TypeScript para gestionar tareas, integrando asistencia de Inteligencia Artificial. Se conecta a una API construida con Django Rest Framework (DRF) para realizar operaciones CRUD completas y aprovechar procesamiento de lenguaje natural en el cliente.

## Arquitectura y Tecnologias

Las principales herramientas y libreias en este proyecto son:

- **React y Vite:** Motor de UI y empaquetador de la aplicacion que ofrecen recargas rapidas en desarrollo.
- **TypeScript:** Tipado estatico definido para reflejar fielmente los modelos DRF del backend.
- **Zustand:** Manejo del estado global orientado a la interfaz de usuario.
- **TanStack React Query:** Gestion asincrona del estado del servidor, peticiones HTTP, cacheo e invalidacion transparente.
- **Material UI (MUI):** Sistema de diseno y componentes visuales.
- **Axios:** Cliente HTTP principal utilizado para la comunicacion con el API.
- **Docker y Docker Compose:** Orquestacion para entornos de desarrollo y preparacion hacia integracion continua y despliegue (CI/CD).

## Requisitos Previos

- Node.js (version 20 o superior).
- Docker y Docker Compose para iniciar ambientes mediante contenedores.

## Modelos y API Esperada

El Frontend y la capa de servicios (`task.service.ts`) estan adaptados a un Router Base de DRF mapeado en el punto de entrada `/tasks/`.

### Estructura de Tareas (Task)

- **id** (Numero o Cadena de Texto)
- **title** (Cadena de Texto, obligatorio)
- **description** (Cadena de Texto, soporta formato texto con marcas para listas IA)
- **status** (Valores validos: `pending`, `completed`)
- **priority** (Valores validos: `low`, `medium`, `high`, `urgent`)
- **created_at**, **updated_at** (Fechas de sistema)

### Metodos Integrados

- **Listar Tareas:** `GET /tasks/`
- **Crear Tarea:** `POST /tasks/`
- **Obtener Tarea:** `GET /tasks/{id}/`
- **Modificar Tarea:** `PUT /tasks/{id}/` o `PATCH /tasks/{id}/`
- **Eliminar Tarea:** `DELETE /tasks/{id}/`

## Despliegue con Docker (Entornos Dev y Prod)

Este ecosistema esta disenado bajo un enfoque Multi-Stage ideal para canalizar su despliegue en servidores. El archivo `docker-compose.yml` gestiona dos topologias de red:

### 1. Entorno de Desarrollo (Development)
Arranca el servidor Vite internamente con un puerto mapeado por defecto y la capacidad de HMR reflejando el codigo en tu archivo local al momento.

Para iniciarlo, ejecuta en la consola:
```bash
docker-compose up -d --build frontend-dev
```
La maquina entrara en escucha localmente sobre `http://localhost:5173`. Tras esto puedes programar y modificar en tu propia maquina sin preocuparte por tener instaladas las dependencias.

### 2. Entorno de Produccion (Production)
Pasa sobre el proceso `npm run build` localizando los archivos estaticos minimizados en una segunda imagen de contencion ejecutando Nginx (configurada optimamente previendo enrutamiento PWA via `nginx.conf`).

Para iniciarlo, ejecuta en la consola:
```bash
docker-compose up -d --build frontend-prod
```
El servidor Nginx sera despachado en tu maquina en el puerto 8080 (`http://localhost:8080`).

## Variables de Entorno

Toda la configuracion principal del aplicativo, como lo es la conexion al API de Django, requiere definir un archivo local base llamado `.env`. En la raiz se halla un archivo guia llamado `.env.example`.

Para usar su conexion:

1. Crea o duplica el archivo llamandolo `.env`.
2. Completa su forma de ser requerido:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Planok - Gestion de Tareas 
VITE_AI_ENABLED=true
VITE_TASKS_PER_PAGE=10
```

## Ejecucion Manual (Sin contenedores)

Si prefieres omitir Docker y aprovechar NPM integramente en todo momento, ejecuta los siguientes comandos:

Cargar dependencias antes de empezar:
```bash
npm install
```

Servidor de desarrollo local Vite:
```bash
npm run dev
```

Auditoria rigurosa de tipos estaticos y compilacion local para entorno productivo:
```bash
npm run build
```

Iniciar tests unitarios y de integracion:
```bash
npm run test
```

## Adaptabilidad Inteligente (IA)

Si configuras `VITE_AI_ENABLED=true`, el formulario de edicion o creacion mostrara botones de asistencia automatica impulsados por el modulo IA de la maquina. Dicha integracion es amigable con bases de datos SQL tradicionales provistas por Django REST ya que evita subarreglos encadenados adjuntando un formato estandar de caracteristica-punto (checklist en texto) que se guarda directamente inyectandose en el cuerpo de la variable `description` principal.
