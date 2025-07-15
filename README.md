# ProyectoAPI por Marcos Gabriel Cuevas Estevez y Roman Santiago Galeote Carrera 

## Tecnologias usadas
- Angular 20
- TypeScript
- RxJS
- HTML / CSS
- SweetAlert2 (alertas)
- Bootstrap
- API REST externas
- Angular Router
- Visual Studio Code

## 🧩 Explicación del código y flujo de la app

La aplicación Angular implementa un flujo completo de autenticación, consumo de productos y operaciones CRUD. A continuación, se detallan los módulos y métodos clave:

### 🔐 Login y autenticación (`login.component.ts`, `auth.service.ts`)

- `login(email, password)`  
  Envía las credenciales a la API de EscuelaJS, obtiene un `access_token` y lo guarda en `localStorage`.

- `getUserProfile(email)`  
  Después del login, obtiene los datos del usuario autenticado (nombre, avatar, rol).

- `isAuthenticated()`  
  Verifica si existe un token válido en el almacenamiento local.

- `logout()`  
  Elimina el token y redirige al login.

### ✅ Protección de rutas (`auth.guard.ts`)

Impide el acceso a rutas privadas si no hay un token válido.

## 📦 Funcionalidades principales de productos

Basadas en la API de productos de [dummyjson.com](https://dummyjson.com):

### 🔍 Buscador de productos

- Permite buscar productos por nombre desde un input.
- Filtra los resultados localmente o con parámetros de la API.

### 📜 Paginación

- Controla la visualización de productos por página.
- Implementado con botones que actualizan los datos visibles mediante `slicing` o parámetros `skip` y `limit`.

### 🧾 Métodos de manejo de productos (`product.service.ts`)

- `getAllProducts()`  
  Obtiene todos los productos de la API.

- `searchProducts(query)`  
  Busca productos que coincidan con el texto ingresado.

- `getProductById(id)`  
  Obtiene información de un producto específico.

- `createProduct(product)`  
  Envía un `POST` a la API para agregar un nuevo producto.

- `updateProduct(id, product)`  
  Envía un `PUT` o `PATCH` para actualizar un producto existente.

- `deleteProduct(id)`  
  Elimina un producto enviando un `DELETE`.

## 🧍‍♂️ Tarjeta de usuario

Después del login, se muestra la información del usuario autenticado:

- Nombre
- Correo electrónico
- Avatar
- Rol

Esto se consigue con el método `getUserProfile()` del `AuthService` después de validar el token recibido.

## 🌐 APIs utilizadas y justificación

### ✅ [https://dummyjson.com/products](https://dummyjson.com/products)

- **Función:** Mostrar, buscar, agregar, actualizar y eliminar productos.
- **Justificación:** Ideal para simular un sistema de inventario sin necesidad de backend propio.

### ✅ [https://api.escuelajs.co/api/v1/users](https://api.escuelajs.co/api/v1/users)

- **Función:** Login de usuarios, recuperación de perfil e imagen.
- **Justificación:** Simula un sistema real de autenticación con JWT y endpoints protegidos.

# 🧪 Pruebas

## 🔐 Logeo (credenciales del API de EscuelaJS)

![Logeo](https://github.com/user-attachments/assets/325cee77-68f4-4c70-b589-5144cc83ed32)

---

## ➕ Agregar producto

![Agregar producto - formulario](https://github.com/user-attachments/assets/fad75b16-69c7-4356-bbba-c8fbfa1040de)
![Agregar producto - consola](https://github.com/user-attachments/assets/d0588490-3c40-4faf-af83-55d34ba96885)

---

## ✏️ Editar producto

![Editar producto - formulario](https://github.com/user-attachments/assets/59c8bd9e-318b-4444-adee-440413ce3034)
![Editar producto - consola](https://github.com/user-attachments/assets/08251efe-55f5-4cfe-a973-33c9d7bc8d31)

---

## 🔍 Ver más información

![Detalle del producto](https://github.com/user-attachments/assets/04e69df7-366d-431b-a246-a9480799e84c)

---

## 🔎 Búsqueda de productos

![Buscador de productos](https://github.com/user-attachments/assets/5c9b2611-8ac3-494b-869b-37a2cb86c5d5)

---

## 👤 Datos del usuario

![Datos del usuario autenticado](https://github.com/user-attachments/assets/3a4fd5c9-e1a7-4214-ab69-b318d5a55c42)

---

## 📄 Paginación

![Paginación - Vista 1](https://github.com/user-attachments/assets/56eb579f-2c0c-4ed0-8c31-8a5a9fc04817)
![Paginación - Vista 2](https://github.com/user-attachments/assets/6168bd0f-9b46-4682-b1e3-d9eb4c68d681)










