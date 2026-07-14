# MisRecetas - Portafolio Full-Stack

## Descripción
**MisRecetas** es una aplicación web full-stack que permite a los usuarios buscar, filtrar y guardar recetas de cocina, así como generar nuevas recetas.

El proyecto cuenta con un sistema completo de autenticación de usuarios y una interfaz moderna y responsiva. Fue diseñado siguiendo un enfoque de alto rendimiento, delegando el filtrado y la paginación a la base de datos MySQL, e integrando capacidades de IA para enriquecer la experiencia del usuario.

Perfecto para demostrar habilidades full-stack reales en un portafolio profesional.

## Objetivo
Como desarrollador autodidacta, creé este proyecto para:

- Mostrar dominio de **Next.js** (App Router) en el frontend y **Node.js + Express** en el backend.
- Implementar una base de datos relacional con **MySQL** para el almacenamiento de usuarios, recetas y favoritos.
- Integrar **Inteligencia Artificial** (Google Gemini) para la generación dinámica de recetas.
- Desarrollar un sistema de autenticación seguro utilizando **JWT** y hashing de contraseñas con **bcryptjs**.
- Crear una interfaz interactiva y dinámica con soporte para **internacionalización (Español/Inglés)** y **modo oscuro/claro**.
- Aplicar buenas prácticas de seguridad: Headers seguros con **Helmet**, limitación de peticiones con **Rate Limiting**.

## Características
- **Autenticación Segura**: Registro e inicio de sesión de usuarios con tokens JWT.
- **Generación por IA**: Creación de recetas personalizadas utilizando Google Gemini.
- **Arquitectura de Alto Rendimiento**: Filtrado, búsqueda y paginación optimizados en el servidor MySQL.
- **Optimización de Recursos (Cloudinary)**: Almacenamiento seguro y externo de imágenes (avatares y recetas) para reducir la carga y transferencia de datos en Vercel.
- **Interfaz Premium**: Diseño elegante con notificaciones Toast, animaciones suaves (Framer Motion) y soporte para modo oscuro/claro.
- **Internacionalización**: Soporte completo para Español e Inglés.
- **Seguridad Robusta**: Implementación de Helmet, Rate Limiting y hashing Bcrypt.

## Tecnologías utilizadas
- **Backend**: Node.js + Express.
- **Base de Datos**: MySQL (TiDB Cloud).
- **Frontend**: Next.js (React), Framer Motion, Lucide React.
- **IA**: Google Generative AI (Gemini).
- **Seguridad**: JWT, bcryptjs, Helmet, Express-rate-limit.
- **Cloud & Almacenamiento**: Cloudinary (imágenes), Vercel (despliegue del cliente y API Serverless).
- **Herramientas de desarrollo**: pnpm (gestor de paquetes optimizado y seguro).

## Estructura del proyecto
```text
Recetas de comida/
├── backend/                  # Servidor Express
│   ├── src/
│   │   ├── server.js        # Punto de entrada del backend
│   │   ├── config/          # Configuración (BD, etc.)
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── scripts/         # Scripts de mantenimiento (ej. migración a Cloudinary)
│   │   └── routes/          # Rutas de la API
│   └── package.json         # Dependencias del backend
├── src/                      # Cliente Next.js
│   ├── app/                 # Rutas y páginas (Next.js App Router)
│   │   └── api/             # API Routes (incluyendo generación por IA)
│   ├── components/          # Componentes reutilizables
│   ├── lib/                 # Librerías utilitarias (Cloudinary, etc.)
│   ├── services/            # Servicios de comunicación con la API
│   └── i18n.ts              # Configuración de internacionalización
├── pnpm-workspace.yaml       # Configuración del monorepo
├── vercel.json               # Configuración para despliegue en Vercel
├── package.json              # Scripts raíz (orquestación)
└── README.md                 # Este archivo
```

## Habilidades demostradas
Este proyecto refleja competencias reales de un Junior Full-Stack listo para aportar valor:

- **Backend sólido**: Rutas seguras, manejo de errores estructurado, conexión a base de datos y orquestación de servicios.
- **Optimización de Costes e Infraestructura**: Uso inteligente de servicios externos (Cloudinary, TiDB Cloud) para sortear las limitaciones de las capas gratuitas de hosting (Serverless Vercel).
- **Integración de IA**: Uso de APIs de inteligencia artificial para agregar valor real al producto.
- **Frontend moderno**: Uso de Next.js, Server Components, manipulación del estado y diseño UI/UX premium.
- **Seguridad y buenas prácticas**: Uso de JWT, hashing de contraseñas, protección contra ataques comunes y logs estructurados.

## Demo en vivo
*(Próximamente disponible / Enlace a desplegar)*

## Notas para empleadores y Clientes
Este proyecto demuestra mi capacidad para construir una aplicación completa desde cero, preocupándome tanto por la seguridad y la infraestructura en el backend como por la usabilidad y el diseño en el frontend, además de estar a la vanguardia con la integración de IA.

Estoy 100% listo para aportar valor real en un equipo como **Junior Full-Stack Developer**.

---

## Contacto
- **GitHub**: [github.com/JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn**: [linkedin.com/in/jesus-bustos-arizmendi-325329283](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo**: jesusbustosarizmendi0@gmail.com
- **Celular/WhatsApp**: +52 762 119 2732

¡Gracias por revisar mi trabajo! 🚀
