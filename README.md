
# 🍕 Página de Pedidos de Pizza

Este proyecto es una aplicación web sencilla para mostrar un menú de pizzas y permitir a los usuarios realizar
pedidos desde el frontend, con manejo de datos mediante un backend en Node.js y Express.

## 📁 Estructura del Proyecto

```plaintext
PAGINA-PIZZAS/
├── backend/
│   ├── data/
│   │   ├── correo.json         # Correos enviados desde el formulario
│   │   ├── ordenes.json        # Pedidos realizados por los usuarios
│   │   └── products.json       # Lista de productos (pizzas)
│   ├── index.js                # Servidor con Express
│   ├── package.json            # Dependencias y configuración de npm
│   └── package-lock.json       # Bloqueo de versiones de dependencias
├── frontend/
│   ├── assets/
│   │   ├── css/                # Estilos CSS
│   │   ├── img/                # Imágenes de las pizzas
│   │   └── js/                 # Scripts JS para funcionalidades
│   ├── index.html              # Página principal del sitio
│   └── terminos.html           # Página de términos y condiciones
├── .hintrc                     # Configuración de HTMLHint
└── README.md                   # Este archivo
```

## 🚀 ¿Cómo ejecutar el proyecto?

### 1. Clona este repositorio

```bash
git clone https://github.com/Juan-Uriel-Rayo/Pagina-web-Pizza.git
cd Pagina-web-Pizza/backend
```

### 2. Instala las dependencias del backend

```bash
npm install
```

### 3. Ejecuta el servidor

```bash
node index.js
```

El backend estará corriendo en `http://localhost:3001`

### 4. Abre el frontend

Abre el archivo `frontend/index.html` en tu navegador o usa una extensión como "Live Server" en Visual Studio Code para visualizarlo.

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Swiper.js (carrusel)
  - ScrollReveal.js (animaciones)
  - Responsive design
- **Backend**:
  - Node.js
  - Express
  - Lectura/escritura de archivos `.json` como base de datos
- **Extras**:
  - Scroll dinámico
  - Formulario de contacto con guardado en JSON
  - Botón de scroll hacia arriba
  - Activación de enlaces por sección

## ✉️ Contacto

Desarrollado por **Juan Uriel Rayo**  
📧 <est.rjuanu@uml.edu.ni>  
🔗 [GitHub](https://github.com/Juan-Uriel-Rayo)

---

¡Gracias por visitar este proyecto! Siéntete libre de dar ⭐️ al repositorio si te fue útil.
