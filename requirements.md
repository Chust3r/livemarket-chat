# **LiveMarket Chat**

API en tiempo real para comunicación en un marketplace, diseñada para garantizar mensajes rápidos, seguros y con características avanzadas de escalabilidad.

---

## **Características principales**

### **Conexión en tiempo real:**
- Soporte para múltiples conexiones simultáneas con autenticación segura mediante WebSockets.
- Estado en línea/desconectado de los usuarios.
- Notificaciones en tiempo real para nuevos mensajes.

### **Mensajería privada:**
- Chats 1:1 entre compradores y vendedores.
- Soporte para mensajes de texto, emojis, imágenes y archivos adjuntos.
- Historial de mensajes almacenado para referencia futura.

### **Notificaciones:**
- Sistema de notificaciones para nuevos mensajes o interacciones.
- Confirmaciones de lectura y entrega de mensajes.

### **Moderación:**
- Reporte y bloqueo de usuarios.
- Filtros para contenido inapropiado o ofensivo.

### **Escalabilidad:**
- Arquitectura lista para manejar miles de usuarios simultáneamente.
- Opciones para implementación de balanceadores de carga.

---

## **Eventos WebSocket**

| **Evento**               | **Descripción**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| **`connect`**             | Emitido cuando un usuario se conecta al servidor WebSocket.                     |
| **`disconnect`**          | Notifica cuando un usuario se desconecta del servidor.                          |
| **`reconnect`**           | Se emite cuando un usuario recupera la conexión después de una caída.           |
| **`message:send`**        | Un cliente envía un mensaje a otro usuario a través del servidor.               |
| **`message:receive`**     | Notifica al receptor que ha recibido un nuevo mensaje.                          |
| **`message:delivered`**   | Confirma la entrega de un mensaje.                                              |
| **`message:read`**        | Indica que un mensaje fue leído por el receptor.                                |
| **`message:error`**       | Notifica al cliente que ocurrió un error al enviar el mensaje (por ejemplo, si no es válido). |
| **`message:sent`**        | Notifica al cliente que el mensaje ha sido enviado con éxito y recibido por el servidor. |
| **`message:edit`**        | Permite editar un mensaje, si no ha sido leído.                                |
| **`message:delete`**      | Permite eliminar un mensaje, si no ha sido leído.                              |
| **`message:history`**     | Solicita y envía el historial de mensajes de una conversación.                  |
| **`user:status`**         | Notifica el estado del usuario (en línea, escribiendo, etc.).                   |
| **`user:typing`**         | Indica que un usuario está escribiendo en un chat.                              |
| **`user:block`**          | Evento para bloquear a un usuario específico.                                   |
| **`user:report`**         | Notifica al servidor que un usuario fue reportado.                              |
| **`notification:new`**    | Evento que notifica al cliente de nuevas interacciones o mensajes.              |
| **`notification:clear`**  | Borra las notificaciones antiguas o leídas.                                    |


---

## **Endpoints REST**

### **Autenticación y Usuarios**

| **Método** | **Endpoint**          | **Descripción**                                         |
|------------|-----------------------|---------------------------------------------------------|
| POST       | `/auth/login`         | Inicia sesión y retorna un token JWT.                   |
| POST       | `/auth/register`      | Registra un nuevo usuario.                              |
| GET        | `/users/:id`          | Obtiene la información de un usuario específico.        |
| PUT        | `/users/:id`          | Actualiza la información del perfil del usuario.        |

---

### **Chats y Mensajes**

| **Método** | **Endpoint**          | **Descripción**                                         |
|------------|-----------------------|---------------------------------------------------------|
| GET        | `/chats`              | Lista de todas las conversaciones del usuario actual.   |
| GET        | `/chats/:id/messages` | Obtiene el historial de mensajes de un chat.            |
| POST       | `/chats/:id/messages` | Envía un mensaje a un chat específico.                  |
| DELETE     | `/chats/:id`          | Elimina/oculta una conversación para el usuario actual. |

---

### **Archivos**

| **Método** | **Endpoint**          | **Descripción**                                         |
|------------|-----------------------|---------------------------------------------------------|
| POST       | `/files`              | Sube un archivo y retorna su URL.                       |
| DELETE     | `/files/:id`          | Elimina un archivo previamente subido.                  |

---

### **Moderación y Configuración**

| **Método** | **Endpoint**          | **Descripción**                                         |
|------------|-----------------------|---------------------------------------------------------|
| POST       | `/users/:id/block`    | Bloquea a un usuario para que no pueda enviarte mensajes.|
| POST       | `/users/:id/report`   | Envía un reporte del usuario para moderación.           |

---

## **Requisitos técnicos**

### **Backend**
- **Lenguaje:** Node.js
- **Framework recomendado:** Nest.js o Express.js
- **Base de datos:** MongoDB o PostgreSQL
- **Servidor WS:** `socket.io` o `ws`

### **Almacenamiento de archivos**
- AWS S3, Cloudinary o algún servicio similar.

### **Escalabilidad**
- Redis para gestionar estados y eventos en tiempo real.
- Balanceadores de carga para soportar múltiples instancias.

---

# Modelos de Base de Datos para LiveMarket Chat

## 1. Modelo: Usuario (`User`)

**Propósito:** Almacena la información de los usuarios registrados.

| Campo         | Tipo             | Descripción                                   |
|---------------|------------------|-----------------------------------------------|
| `id`          | String (UUID)    | Identificador único del usuario.             |
| `username`    | String           | Nombre de usuario único.                     |
| `email`       | String           | Correo electrónico del usuario.              |
| `password`    | String (hashed)  | Contraseña encriptada del usuario.           |
| `avatarUrl`   | String (opcional)| URL del avatar del usuario.                  |
| `status`      | String           | Estado del usuario (`online`, `offline`).    |
| `createdAt`   | Date             | Fecha de creación del usuario.               |
| `updatedAt`   | Date             | Fecha de última actualización del usuario.   |

---

## 2. Modelo: Mensaje (`Message`)

**Propósito:** Almacena los mensajes enviados dentro de un chat.

| Campo         | Tipo          | Descripción                                   |
|---------------|---------------|-----------------------------------------------|
| `id`          | String (UUID) | Identificador único del mensaje.             |
| `chatId`      | String (UUID) | ID del chat al que pertenece el mensaje.     |
| `senderId`    | String (UUID) | ID del usuario que envió el mensaje.         |
| `content`     | String        | Contenido del mensaje (texto o archivos).    |
| `type`        | String        | Tipo de mensaje (`text`, `image`, `file`).   |
| `createdAt`   | Date          | Fecha y hora en que se envió el mensaje.     |

---

## 3. Modelo: Sala de Chat (`Chat`)

**Propósito:** Representa las salas de chat donde los usuarios interactúan.

| Campo         | Tipo          | Descripción                                   |
|---------------|---------------|-----------------------------------------------|
| `id`          | String (UUID) | Identificador único del chat.                |
| `type`        | String        | Tipo de chat (`private`, `group`).           |
| `participants`| Array<String> | Lista de IDs de los participantes del chat.  |
| `name`        | String        | Nombre del chat (solo en chats grupales).    |
| `createdAt`   | Date          | Fecha de creación del chat.                  |
| `updatedAt`   | Date          | Fecha de última actualización del chat.      |

---

## 4. Modelo: Producto (`Product`) *(Opcional)*

**Propósito:** Representa los productos relacionados con las conversaciones en el chat.

| Campo         | Tipo          | Descripción                                   |
|---------------|---------------|-----------------------------------------------|
| `id`          | String (UUID) | Identificador único del producto.            |
| `name`        | String        | Nombre del producto.                         |
| `price`       | Float         | Precio del producto.                         |
| `url`         | String        | Enlace directo al producto (e-commerce).     |
| `imageUrl`    | String        | URL de la imagen del producto.               |
| `createdAt`   | Date          | Fecha de creación del producto.              |

---

## 5. Modelo: Eventos de Conexión (`ConnectionLog`)

**Propósito:** Almacena eventos de conexión/desconexión de los usuarios.

| Campo         | Tipo          | Descripción                                   |
|---------------|---------------|-----------------------------------------------|
| `id`          | String (UUID) | Identificador único del evento.              |
| `userId`      | String (UUID) | ID del usuario asociado al evento.           |
| `type`        | String        | Tipo de evento (`connect`, `disconnect`).    |
| `timestamp`   | Date          | Fecha y hora del evento de conexión.         |

---

## Relaciones entre Modelos

- **Usuarios y Mensajes:**  
  Un **usuario** puede enviar múltiples **mensajes**. Cada mensaje tiene un `senderId` que se vincula a un usuario.

- **Mensajes y Chats:**  
  Un **chat** contiene múltiples **mensajes**. Cada mensaje tiene un `chatId` que se refiere a un chat.

- **Usuarios y Chats:**  
  Un **chat** puede tener múltiples **participantes**. Estos participantes son **usuarios** relacionados con el chat.

- **Productos y Mensajes** *(Opcional)*  
  Si los mensajes contienen referencias a productos, un **mensaje** puede estar asociado a un **producto**.

---
