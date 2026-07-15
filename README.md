# 🍳 MisRecetas - Plataforma Full-Stack Avanzada

## 🚀 Descripción del Proyecto
**MisRecetas** es una aplicación web full-stack integral diseñada para buscar, filtrar, almacenar y gestionar recetas culinarias. Nace de la necesidad de ofrecer una experiencia gastronómica digital rápida, confiable y altamente organizada.

Construida con **Next.js (App Router)** en el frontend y un robusto backend con **Node.js + Express**, esta plataforma va mucho más allá de un simple CRUD. Incorpora una arquitectura moderna orientada a la escalabilidad y el alto rendimiento, separando estratégicamente las responsabilidades de almacenamiento en la nube (Serverless): la **data estructurada** y relacional es gestionada por una base de datos SQL genuina en la nube (**TiDB Cloud**), mientras que la **data binaria** (imágenes y recursos pesados) se delega a una red de entrega de contenido externa (**Cloudinary**). Todo esto protegido por múltiples capas de seguridad entrelazadas.

El proyecto fue diseñado meticulosamente para resolver cuellos de botella comunes en el desarrollo web moderno: manejo eficiente de imágenes, protección de rutas y optimización en las consultas a grandes volúmenes de datos. Todo esto con el objetivo de demostrar un dominio completo en el ciclo de vida del desarrollo de software y diseño de infraestructuras, captando la atención de los perfiles más técnicos y exigentes.

## 💎 Valor Técnico y Arquitectura (Por qué destaca este proyecto)

- **☁️ Datos Estructurados (TiDB Cloud):** La espina dorsal del sistema. Toda la lógica relacional y **data estructurada**—desde la información de los usuarios hasta el complejo catálogo de recetas y favoritos—se apoya en **TiDB Cloud (MySQL-compatible)**. Esta elección establece a TiDB como la *verdadera* base de datos del proyecto, proporcionando un entorno serverless de alta disponibilidad que garantiza un rendimiento excepcional. Permite delegar cargas pesadas de procesamiento, como el filtrado multicriterio y la paginación, directamente al motor SQL, liberando la memoria del servidor Node.js.
- **🖼️ Data Binaria y CDN (Cloudinary):** El manejo de recursos multimedia es crítico en una app de recetas, pero almacenarlos en bases de datos relacionales es una mala práctica. Por ello, la **data binaria** (imágenes de avatares y platillos) se aísla mediante una integración completa con **Cloudinary**. Este servicio actúa como almacenamiento externo y CDN, permitiendo la transformación al vuelo (redimensionamiento, compresión) y una entrega ultra rápida. Como resultado, se minimiza drásticamente el consumo de ancho de banda y se mejoran las métricas Core Web Vitals (LCP).
- **🛡️ Capas de Seguridad Multi-Nivel (Security-First):** La seguridad no fue un pensamiento de último minuto; es fundacional en MisRecetas:
  - **Autenticación Robusta:** La identidad se gestiona en un sistema cerrado mediante **JWT (JSON Web Tokens)** sin estado, asegurando sesiones rápidas y seguras. Las credenciales están fuertemente encriptadas en la base de datos utilizando algoritmos iterativos con **bcryptjs**.
  - **Defensas Activas:** Implementación perimetral de **Helmet** para asegurar proactivamente las cabeceras HTTP, ocultando tecnologías subyacentes. Se suma un sistema de **Rate Limiting** para ahogar intentos de ataques de denegación de servicio (DDoS) y fuerza bruta en los endpoints de inicio de sesión.
  - **Protección de Datos:** Las rutas privadas exigen validaciones de token estrictas. A su vez, los payloads (cuerpos de las peticiones) pasan por una validación profunda para sanitizar entradas, neutralizando por completo inyecciones SQL y ataques Cross-Site Scripting (XSS).
- **👑 Panel de Administración (Admin Dashboard):** El sistema va más allá del usuario final. Incluye un área administrativa protegida basada en roles (RBAC). Desde este dashboard se pueden gestionar métricas vitales del sistema, administrar a los usuarios registrados, moderar el contenido del catálogo y auditar actividades. Es una demostración clara de visión empresarial y capacidades de gestión técnica.
- **⚙️ Motor de Búsqueda y Filtrado Avanzado:** A diferencia del filtrado en cliente que compromete la memoria, MisRecetas implementa un motor de consultas dinámicas en el backend. Los usuarios pueden buscar por ingredientes, categorías y popularidad de forma simultánea. El backend traduce esto en queries SQL optimizados, retornando datos paginados de manera ultra eficiente.

## ✨ Características Principales de la Experiencia de Usuario

- **Interfaz Premium e Internacionalización**: La presentación lo es todo. Se desarrolló un diseño elegante y responsivo con animaciones fluidas (Framer Motion) que dan vida a las interacciones. Además, cuenta con notificaciones interactivas tipo "toast" y soporte nativo para **Multi-idioma (Inglés / Español)** y **Modo Claro / Oscuro**, brindando una experiencia de usuario (UX) inmersiva e impecable, adaptable a las preferencias de cada persona.
- **Arquitectura de Alto Rendimiento Front-End**: Aprovechamiento al máximo del poder de Next.js mediante una combinación inteligente de Server Components y Client Components. Esto garantiza un renderizado inicial ultrarrápido, excelente optimización para motores de búsqueda (SEO) y tiempos de respuesta casi instantáneos al interactuar con la API RESTful en Node.
- **Manejo de Estado Complejo**: Orquestación limpia y centralizada de los estados en el lado del cliente. Desde el manejo de formularios complejos y sus validaciones en tiempo real, hasta la sincronización optimista del botón de "Favoritos", asegurando que la interfaz jamás se sienta bloqueada mientras el backend procesa las solicitudes.

## 🛠️ Stack Tecnológico Completo

- **Frontend**: Next.js (React), Tailwind CSS (para estilización ágil), Framer Motion (micro-interacciones), Lucide React (iconografía).
- **Backend**: Node.js v20+, Express.js.
- **Base de Datos**: MySQL alojada en el ecosistema de **TiDB Cloud** Serverless.
- **Almacenamiento Cloud**: Cloudinary (Actuando como Storage y CDN).
- **Seguridad y Criptografía**: JWT, bcryptjs, Helmet, express-rate-limit.
- **Infraestructura y Despliegue**: Vercel (Hospedando el Frontend SSR y la Serverless API del backend).
- **Herramientas de Desarrollo**: pnpm (Gestor de paquetes rápido y determinista, garantizando lockfiles seguros).

## 📂 Arquitectura y Estructura del Proyecto

El código está organizado en un esquema de monorepo para facilitar el mantenimiento y la escalabilidad de ambas piezas (cliente y servidor):

```text
Recetas de comida/
├── backend/                  # Servidor Express (API REST)
│   ├── src/
│   │   ├── server.js        # Entry point del servidor
│   │   ├── config/          # Configuración de variables de entorno y DB
│   │   ├── controllers/     # Lógica de negocio de los endpoints
│   │   ├── middleware/      # Capas de seguridad, limitadores y validación JWT
│   │   ├── scripts/         # Herramientas de mantenimiento y cron jobs
│   │   └── routes/          # Definición de rutas y mapeo de HTTP verbs
│   └── package.json
├── src/                      # Cliente Next.js (App Router)
│   ├── app/                 # Rutas de página (SSR / SSG / CSR)
│   │   └── api/             # Endpoints puente (API Routes de Next.js)
│   ├── components/          # Componentes de UI modulares y reutilizables
│   ├── lib/                 # Utilidades (Helpers para Cloudinary, Formateadores)
│   ├── services/            # Clientes HTTP (Fetchers aislados hacia el backend)
│   └── i18n.ts              # Diccionarios y configuración de traducciones
├── pnpm-workspace.yaml       # Configuración de espacios de trabajo del Monorepo
├── vercel.json               # Configuración de despliegue, rewrites y headers
└── package.json
```

## 🎯 Notas para Reclutadores y CTOs

Si estás leyendo esto, sabes que armar un "To-Do list" no refleja los retos reales de producción. **Este proyecto es el reflejo directo de mis competencias maduras como Desarrollador Full-Stack.**

Más allá de simplemente "escribir código que funcione", esta aplicación demuestra mi capacidad para tomar decisiones arquitectónicas fundadas. Demuestra cómo equilibro el **rendimiento, los costos operativos de infraestructura y una experiencia de usuario sobresaliente**.

He diseñado MisRecetas resolviendo problemas genuinos que enfrentan los equipos de software hoy en día:
- **Gestión de Assets**: Mitigación de cuellos de botella y sobrecostos en transferencia de red delegando la entrega de imágenes a un CDN especializado (Cloudinary).
- **Seguridad**: Protección sistemática de endpoints públicos y validación estricta del flujo de datos para prevenir vulnerabilidades comunes (OWASP).
- **Visión de Producto**: Creación de un panel administrativo que empodera a los stakeholders con métricas y herramientas de moderación, no solo pensando en el usuario final.

Estoy 100% preparado para integrarme a equipos dinámicos, adaptarme a arquitecturas complejas y aportar valor tangible, seguro y escalable desde el día uno.

## 🔗 Demo en vivo
*(Próximamente disponible / Enlace a desplegar)*

---

## 📬 Hablemos
- **GitHub**: [github.com/JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn**: [linkedin.com/in/jesus-bustos-arizmendi-325329283](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo**: jesusbustosarizmendi0@gmail.com
- **Celular/WhatsApp**: +52 762 119 2732

¡Gracias por tomarte el tiempo de revisar mi código y mi arquitectura! 🚀
