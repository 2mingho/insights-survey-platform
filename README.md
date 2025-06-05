## Estructura del Proyecto

insights-survey-platform/
│
├── public/                     # Carpeta para el frontend (servida desde Express)
│   ├── index.html              # Página de verificación (ID_input)
│   ├── encuestador.html        # Vista info_encuestador
│   ├── about.html              # Vista about_us
│   ├── login.html              # Login administrador
│   ├── view_encuestadores.html # view_encuestadores
│   ├── add_encuestador.html    # add_encuestadores
│   ├── edit_encuestador.html   # edit_encuestadores
│   ├── proyectos.html          # view_proyectos
│   ├── add_proyecto.html       # add_proyectos
│   ├── edit_proyecto.html      # edit_proyectos
│   ├── /css/
│   │   └── styles.css          # Estilos globales con Tailwind o personalizados
│   └── /js/
│       ├── main.js             # Lógica común de verificación
│       ├── admin.js            # Lógica del panel admin
│       └── api.js              # Utilidades para fetch API
│
├── models/
│   ├── Encuestador.js          # Esquema de Mongoose
│   └── Proyecto.js
│
├── routes/
│   ├── encuestadores.js        # Rutas para API de encuestadores
│   ├── proyectos.js            # Rutas para API de proyectos
│   └── admin.js                # Login y autenticación
│
├── controllers/                # Lógica separada (opcional)
│   ├── encuestadorController.js
│   ├── proyectoController.js
│   └── adminController.js
│
├── .env                        # Variables de entorno (Mongo URI, JWT secret, etc.)
├── .gitignore
├── package.json
├── server.js                   # Servidor principal (Express)
└── README.md