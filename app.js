const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 80;

app.use(express.json());
app.use(cors());

// Detecta si está en Vercel: variable de entorno VERCEL
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_URL;
const DB_FILENAME = "db.json";
const DB_PATH = isVercel
  ? path.join("/tmp", DB_FILENAME) // En Vercel, usa /tmp
  : path.join(__dirname, DB_FILENAME); // Local, usa la raíz del proyecto

// Si está en Vercel y el archivo no existe en /tmp, cópialo desde el deploy
if (isVercel && !fs.existsSync(DB_PATH)) {
  const src = path.join(__dirname, DB_FILENAME);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, DB_PATH);
  } else {
    // Si no existe el archivo en el deploy, inicializa vacío
    fs.writeFileSync(DB_PATH, JSON.stringify({
      empleados: [],
      usuarios: [],
      productos: [],
      proveedores: [],
      categorias: [],
      ventas: [],
      inventario: [],
      pedidos: [],
      departamentos: [],
      proyectos: [],
      beneficios: [],
      sucursales: [],
      equipos: []
    }, null, 2), "utf-8");
  }
}

function getDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function createCrudFor(entity, requiredFields = []) {
  // Obtener todos
  app.get(`/${entity}`, (req, res) => {
    const db = getDB();
    res.json(db[entity]);
  });

  // Obtener por ID
  app.get(`/${entity}/:id`, (req, res) => {
    const db = getDB();
    const item = db[entity].find(e => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ mensaje: `${capitalize(entity)} no encontrado` });
    }
    res.json(item);
  });

  // Crear nuevo
  app.post(`/${entity}`, (req, res) => {
    const db = getDB();
    const item = req.body;
    for (const campo of requiredFields) {
      if (!item[campo]) {
        return res.status(400).json({ mensaje: `Campo requerido: ${campo}` });
      }
    }
    item.id = (Math.max(0, ...db[entity].map(e => Number(e.id) || 0)) + 1).toString();
    db[entity].push(item);
    saveDB(db);
    res.status(201).json({ mensaje: `${capitalize(entity)} agregado`, id: item.id });
  });

  // Actualizar
  app.put(`/${entity}/:id`, (req, res) => {
    const db = getDB();
    const index = db[entity].findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ mensaje: `${capitalize(entity)} no encontrado` });
    }
    db[entity][index] = { ...db[entity][index], ...req.body, id: req.params.id };
    saveDB(db);
    res.json({ mensaje: `${capitalize(entity)} actualizado correctamente` });
  });

  // Eliminar
  app.delete(`/${entity}/:id`, (req, res) => {
    const db = getDB();
    const index = db[entity].findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ mensaje: `${capitalize(entity)} no encontrado` });
    }
    db[entity].splice(index, 1);
    saveDB(db);
    res.json({ mensaje: `${capitalize(entity)} eliminado correctamente` });
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// CRUD para todas las entidades
createCrudFor("empleados", ["nombres", "apellidos", "documento"]);
createCrudFor("usuarios", ["nombre", "correo", "username", "password"]);
createCrudFor("productos", ["codigo_barras", "nombre", "precio_compra", "precio_venta", "stock"]);
createCrudFor("proveedores", ["nombre", "nit", "telefono", "correo", "direccion", "ciudad"]);
createCrudFor("categorias", ["nombre"]);
createCrudFor("ventas", ["fecha", "cliente_id", "empleado_id", "total", "metodo_pago", "detalles"]);
createCrudFor("inventario", ["producto_id", "cantidad", "ubicacion"]);
createCrudFor("pedidos", ["proveedor_id", "fecha_pedido", "estado", "total", "items"]);
createCrudFor("departamentos", ["nombre", "presupuesto", "ubicacion"]);
createCrudFor("proyectos", ["nombre", "descripcion", "fecha_inicio", "presupuesto", "responsable_id"]);
createCrudFor("beneficios", ["empleado_id", "tipo"]);
createCrudFor("sucursales", ["nombre", "direccion", "ciudad", "telefono", "area_m2", "fecha_apertura"]);
createCrudFor("equipos", ["tipo", "marca", "modelo", "serial", "sucursal_id", "fecha_adquisicion", "valor"]);

// Servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});