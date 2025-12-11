# Ubs_react
Creacion de la pagina de la barberia en react




src/
├── components/          # Componentes de UI reusables y de presentación (VISTA)
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Input.jsx
├── containers/          # Componentes inteligentes con lógica y estado (CONTROLADOR/VISTA)
│   ├── Admin/
│   │   └── AdminDashboard.jsx
│   ├── Client/
│   │   └── ClientBooking.jsx
│   └── Layout.jsx
├── context/             # Manejo global de estado (simulando una parte del MODELO)
│   └── CitasContext.js
├── hooks/               # Lógica de datos reutilizable y custom hooks (MODELO/CONTROLADOR)
│   ├── useCitas.js      # Lógica para obtener, crear y actualizar citas
│   └── useAuth.js       # Lógica de autenticación (login/logout)
├── services/            # Interacción con la API o base de datos (MODELO)
│   └── api.js
├── utils/               # Funciones de ayuda (formato de fecha, validaciones)
│   └── dateUtils.js
└── App.jsx