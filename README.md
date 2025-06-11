# Proyecto Supermercado 

## Ingenias

### Proyecto 2

## Objetivo

Este es un proyecto para gestionar una bbdd de productos de supermercado, utilizando Node.js, Express.js y MongoDB para el acceso a la bbdd

---

# Acceso al sitio

[http://localhost:3000](http://localhost:3000)

---

## Estructura de los objetos en la base de datos

```json
{
  "codigo": 9012,
  "nombre": "Detergente",
  "precio": 8.75,
  "categoria": "Limpieza"
}

# Endpoints disponibles

| Peticion | URL | Descripción |
|:--------:|:---:|:-----------:|
| GET | `/` | Ruta raiz |
| GET |  `/productos` | Obtener todos los productos en la bbdd |
| GET | `/productos/:nombre` | Busqueda de producto por nombre |
| GET | `/productos/:codigo` | Busqueda de producto por codigo |
| POST | `/productos` | Agregar nuevos productos a la bbdd|


