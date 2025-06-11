# Proyecto Supermercado 

## Ingenias

### Proyecto 2

## Objetivo

Este es un proyecto para gestionar una bbdd de productos de supermercado, utilizando Node.js, Express.js y MongoDB para el acceso a la bbdd

---

## Arquitectura de la Aplicación

```mermaid
graph TD
    A[Frontend (Navegador)] --> B[Backend (Node.js + Express)]
    B --> C[Base de datos (MongoDB)]
```

---

## Estructura de los objetos en la base de datos

```json
{
  "codigo": 9012,
  "nombre": "Detergente",
  "precio": 8.75,
  "categoria": "Limpieza"
}
```

---

# Acceso al sitio

[http://localhost:3000](http://localhost:3000)

---

# Endpoints disponibles

| Peticion | URL | Descripción |
|:--------:|:---:|:-----------:|
| GET | `/` | Ruta raiz |
| GET |  `/productos` | Obtener todos los productos en la bbdd |
| GET | `/productos/:nombre` | Busqueda de producto por nombre |
| GET | `/productos/:codigo` | Busqueda de producto por codigo |
| POST | `/productos` | Agregar nuevos productos a la bbdd|

# Funcionamiento de la app

```mermaid
graph TD
    U[Usuario (Navegador)] -->|1. Solicitud GET /productos| FE[Frontend (App Web)]
    FE -->|2. Llama API REST GET /productos| BE[Backend (Node.js + Express)]
    BE -->|3. Consulta productos| DB[Base de datos (MongoDB)]
    DB -->|4. Retorna lista de productos| BE
    BE -->|5. Envía respuesta JSON con productos| FE
    FE -->|6. Renderiza productos en UI| U
