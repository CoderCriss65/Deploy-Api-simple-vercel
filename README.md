# API REST Node.js CRUD con archivo `db.json`

Esta API te permite realizar operaciones CRUD (crear, leer, actualizar y eliminar) sobre varias entidades usando un archivo local `db.json` como almacenamiento, sin necesidad de una base de datos relacional como MySQL.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Estructura de Archivos](#estructura-de-archivos)
- [Inicio del servidor](#inicio-del-servidor)
- [Rutas disponibles](#rutas-disponibles)
- [Ejemplo de Objeto `db.json`](#ejemplo-de-objeto-dbjson)
- [Notas](#notas)

---

## Requisitos

- Node.js (v16 o superior recomendado)
- npm

---

## Instalación

1. **Clona el repositorio o descarga el código fuente en una carpeta local.**

2. **Instala las dependencias:**

   ```sh
   npm install
   ```

3. **Verifica que el archivo `db.json` exista en la raíz del proyecto. Si no existe, crea uno (ver ejemplo abajo).**

---

## Estructura de Archivos

```
/
├── app.js         # Archivo principal del servidor Express
├── db.json        # Archivo de datos (base de datos simulada en JSON)
├── package.json   # Configuración de npm y scripts
└── README.md      # Este archivo
```

---

## Inicio del servidor

En la terminal, ejecuta:

```sh
npm start
```

El servidor se iniciará por defecto en [http://localhost:8080](http://localhost:8080).

---

## Rutas disponibles

Cada entidad soporta los siguientes endpoints (CRUD):

### Ejemplo usando `/empleados` (igual para usuarios, productos, etc):

- **GET** `/empleados`  
  Retorna todos los empleados.

- **GET** `/empleados/:id`  
  Retorna un empleado por su ID.

- **POST** `/empleados`  
  Crea un nuevo empleado.  
  El campo `id` se genera automáticamente.

- **PUT** `/empleados/:id`  
  Actualiza un empleado por su ID.

- **DELETE** `/empleados/:id`  
  Elimina un empleado por su ID.

### Entidades soportadas

- `/empleados`
- `/usuarios`
- `/productos`
- `/proveedores`
- `/categorias`
- `/ventas`
- `/inventario`
- `/pedidos`
- `/departamentos`
- `/proyectos`
- `/beneficios`
- `/sucursales`
- `/equipos`

**Nota:** Cambia el nombre en la ruta para operar sobre la entidad deseada, por ejemplo: `/productos`, `/ventas`, etc.

---

## Ejemplo de Objeto `db.json`

Asegúrate de que tu archivo `db.json` (en la raíz del proyecto) tenga al menos la siguiente estructura para funcionar correctamente:

```json
{
  "empleados": [],
  "usuarios": [],
  "productos": [],
  "proveedores": [],
  "categorias": [],
  "ventas": [],
  "inventario": [],
  "pedidos": [],
  "departamentos": [],
  "proyectos": [],
  "beneficios": [],
  "sucursales": [],
  "equipos": []
}
```

Puedes llenarlo con registros de ejemplo si lo deseas.

---

## Ejemplo de petición POST

**Crear un nuevo empleado:**

```http
POST /empleados
Content-Type: application/json

{
  "nombres": "Ana",
  "apellidos": "Lopez",
  "documento": "987654321",
  "fechanacimiento": "1992-10-01T00:00:00.000Z",
  "telefono": "3100000000",
  "correo": "ana.lopez@email.com",
  "direccion": "Cra 10 #20-30",
  "ciudad": "Medellín",
  "contrato": "Planta",
  "jornada": "Tarde"
}
```

**Respuesta exitosa:**

```json
{
  "mensaje": "Empleados agregado",
  "id": "2"
}
```

---

## Notas

- El `id` de cada entidad se autogenera y es único.
- Todos los cambios se guardan en el archivo `db.json`. Si el archivo se borra o edita manualmente, puedes perder datos.
- No es necesario reiniciar el servidor para ver cambios en el archivo `db.json`.
- Para desarrollo puedes usar [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/) para probar los endpoints.

---

¿Tienes dudas? ¡Abre un issue o contacta al autor!
