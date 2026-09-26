import type { ProjectTitle } from "@/data/project-images"

export const site = {
  name: "Julián Quintero",
  shortName: "JulianDev",
  role: "Desarrollador Web Full-Stack",
  title: "Tecnólogo en Desarrollo de Software",
  location: "Medellín, Colombia",
  timezone: "America/Bogota",
  email: "julianquinterortiz@gmail.com",
  available: true,
  availabilityLabel: "Disponible para trabajar",

  /**
   * Agenda de reuniones. Mientras sea `null`, el botón de "agendar" abre un
   * `mailto:` precargado. Alollars con una URL real (Cal.com, Calendly,
   * Google Appointment Schedule…) el enlace abre el calendario directamente.
   */
  bookingUrl: null as string | null,

  /** Hoja de vida: versión web imprimible y PDF descargable. */
  cv: {
    page: "/cv",
    pdf: "/cv-julian-quintero.pdf",
  },
} as const

export const socials = [
  {
    label: "GitHub",
    name: "JulianD3v",
    href: "https://github.com/JulianD3v",
    icon: "github",
  },
  {
    label: "LinkedIn",
    name: "julian-quintero",
    href: "https://www.linkedin.com/in/julian-quintero-8156771bb/",
    icon: "linkedin",
  },
  {
    label: "Email",
    name: site.email,
    href: `mailto:${site.email}`,
    icon: "mail",
  },
] as const

export const nav = [
  { title: "Sobre mí", label: "sobre-mi", url: "/#sobre-mi" },
  { title: "Experiencia", label: "experiencia", url: "/#experiencia" },
  { title: "Proyectos", label: "proyectos", url: "/#proyectos" },
  { title: "Stack", label: "stack", url: "/#stack" },
  { title: "Contacto", label: "contacto", url: "/#contacto" },
] as const

export const hero = {
  kicker: "Desarrollador Web · Medellín, CO",
  headline: ["Diseño y construyo", "productos web"],
  headlineAccent: "intencionados y humanos.",
  lead: "+1 año de experiencia. <strong>Tecnólogo en Desarrollo de Software</strong> y <strong>Desarrollador Web</strong> especializado en crear aplicaciones únicas y escalables, de la base de datos hasta la interfaz.",
  rotating: ["Disponible para proyectos", "2026"],
  stats: [
    { value: "+1", label: "Año de experiencia" },
    { value: "4", label: "Años programando" },
    { value: "15+", label: "Tecnologías y herramientas" },
    { value: "3", label: "Roles y proyectos" },
  ],
} as const

export const marquee = [
  "Desarrollo Web",
  "Frontend",
  "Backend",
  "APIs REST",
  "Bases de Datos",
  "Docker",
  "Angular",
  "Laravel",
  "MySQL",
  "UI Engineering",
  "Automatización",
  "Soporte TI",
  "Metodologías Ágiles",
] as const

export type TechItem = {
  name: string
  icon: string
  category?: string
}

export const techMarqueeRow1: readonly TechItem[] = [
  { name: "Angular", icon: "angular", category: "Framework" },
  { name: "Laravel", icon: "laravel", category: "Backend" },
  { name: "TypeScript", icon: "typescript", category: "Language" },
  { name: "Docker", icon: "docker", category: "DevOps" },
  { name: "Next.js", icon: "nextjs", category: "React Framework" },
  { name: "Tailwind CSS", icon: "tailwind", category: "Styling" },
  { name: "Astro", icon: "astro", category: "Web Platform" },
  { name: "MySQL", icon: "mysql", category: "Database" },
  { name: "Node.js", icon: "nodejs", category: "Runtime" },
]

export const techMarqueeRow2: readonly TechItem[] = [
  { name: "JavaScript", icon: "javascript", category: "Language" },
  { name: "Java - SpringBoot", icon: "java", category: "Backend" },
  { name: ".NET", icon: "dotnet", category: "Framework" },
  { name: "HTML5", icon: "html", category: "Markup" },
  { name: "CSS3", icon: "css", category: "Styling" },
  { name: "WordPress", icon: "wordpress", category: "CMS" },
  { name: "Bootstrap", icon: "bootstrap", category: "UI Library" },
  { name: "GitHub", icon: "github", category: "VCS" },
  { name: "VS Code", icon: "vscode", category: "Tooling" },
]

export const about = {
  kicker: "Sobre mí",
  title: "Un dev que piensa en producto",
  paragraphs: [
    "Me llamo Julián Quintero. Empecé en la programación hace <strong>4 años</strong> en la universidad y también de forma autodidacta. Hoy desarrollo software con el equipo de <strong>Ingeneo S.A.S</strong>, moviéndome entre el análisis, el desarrollo y el soporte de primer nivel.",
    "Colaboré profesionalmente con el equipo de <strong>EasyFace</strong> en el desarrollo de módulos y la <strong>optimización de consultas</strong>, aplicando metodologías ágiles como <strong>SCRUM</strong> para entregar software con calidad real.",
    "Como freelance construí proyectos importantes para la industria, como <strong><em>Haro Epico</em></strong>, que llevé desde cero: definición, desarrollo, despliegue y soporte. Mi objetivo es consolidar mi experiencia, contribuir a soluciones innovadoras y seguir escalando profesionalmente.",
  ],
  principles: [
    "Código limpio y mantenible",
    "Diseño antes que código",
    "Siempre aprendiendo",
    "Autonomía y comunicación",
  ],
} as const

export const experience = [
  {
    date: "Actualmente",
    title: "Analista de Soporte TI",
    company: "Ingeneo S.A.S",
    link: "https://ingeneo.com.co/",
    description:
      "Responsable de implementar flujos de chatbot, soporte técnico de primer nivel y mantenimiento de sistemas internos. Colaboro con los equipos de desarrollo para mejorar la eficiencia operativa y la experiencia del usuario.",
    highlights: [
      "Implementación de flujos de chatbot",
      "Soporte técnico de primer nivel",
      "Mantenimiento de sistemas internos",
      "Optimización de procesos operativos",
    ],
  },
  {
    date: "Enero 2026",
    title: "Practicante en Análisis y Desarrollo de Software",
    company: "Ingeneo S.A.S",
    description:
      "Desarrollo y soporte de aplicaciones web con tecnologías como Angular, Laravel y bases de datos SQL, implementando prácticas de SCRUM para mejorar la eficiencia del equipo y la calidad del software entregado.",
    highlights: [
      "Desarrollo de aplicaciones web",
      "Angular, Laravel y SQL",
      "Flujo de trabajo con SCRUM",
    ],
  },
  {
    date: "Junio 2025",
    title: "Desarrollador Freelance",
    company: "Freelance",
    description:
      "Responsable de la creación y desarrollo de aplicaciones web: montaje y despliegue en servidores con tecnologías como Docker y WordPress, en colaboración directa con clientes para entregar soluciones personalizadas.",
    highlights: [
      "Aplicaciones web de cero a producción",
      "Montaje y despliegue en servidores",
      "Docker y WordPress",
      "Relación directa con clientes",
    ],
  },
] as const

export type Project = {
  /** Clave del mapa `projectImages`: obliga a que la imagen exista. */
  title: ProjectTitle
  kicker: string
  description: string
  link?: string
  github?: string
  imageAlt: string
  tags: readonly { name: string }[]
  featured?: boolean
  detail?: {
    role: string
    year: string
    architecture: readonly string[]
    decisions: readonly string[]
  }
}

export const projects = [
  {
    title: "EasyFace",
    kicker: "Reconocimiento facial",
    description:
      "Software de reconocimiento facial ampliamente utilizado en la industria para el control de acceso del personal. Colaboré en el desarrollo de módulos y la optimización de consultas.",
    link: "https://www.instagram.com/ingeneoeasyface/?hl=es-la",
    imageAlt: "Interfaz del software de reconocimiento facial EasyFace",
    tags: [{ name: "Laravel" }, { name: "Angular" }, { name: "MySQL" }],
    featured: true,
    detail: {
      role: "Desarrollo de módulos y optimización",
      year: "2026",
      architecture: [
        "Interfaz web en Angular",
        "API y lógica de negocio en Laravel",
        "Persistencia en MySQL",
        "Entrega continua con metodologías ágiles (SCRUM)",
      ],
      decisions: [
        "Reescritura de consultas lentas con índices y ajustes en el plan de ejecución",
        "Módulos independientes para que el equipo pudiera avanzar en paralelo",
        "Contratos de API tipados entre el frontend y el backend",
      ],
    },
  },
  {
    title: "Haro Epico",
    kicker: "E-commerce",
    description:
      "Tienda en línea construida desde cero con WordPress y MySQL, montada en contenedores Docker. Del concepto al despliegue en producción.",
    link: "https://haroepico.netlify.app",
    imageAlt: "Tienda en línea Haro Epico",
    tags: [{ name: "WordPress" }, { name: "MySQL" }, { name: "Docker" }],
    detail: {
      role: "Proyecto freelance de principio a fin",
      year: "2025",
      architecture: [
        "WordPress con tema propio para el catálogo y el checkout",
        "MySQL para pedidos, inventario y clientes",
        "Servidor en contenedor Docker con despliegue automatizado",
      ],
      decisions: [
        "Docker para replicar el entorno de desarrollo y producción sin sorpresas",
        "Separar el catálogo del tema para poder actualizar WordPress sin romper la tienda",
        "Imágenes optimizadas y caché para que el catálogo cargue rápido en móvil",
      ],
    },
  },
  {
    title: "CeleDesign",
    kicker: "Portafolio para diseñadora",
    description:
      "Portafolio para una diseñadora gráfica, desarrollado con Astro para obtener un rendimiento óptimo y una experiencia de usuario excepcional.",
    link: "https://celena.site",
    github: "https://github.com/JulianD3v/celedesign",
    imageAlt: "Portafolio CeleDesign hecho con Astro",
    tags: [{ name: "Astro" }, { name: "Docker" }],
    detail: {
      role: "Diseño y desarrollo completo",
      year: "2025",
      architecture: [
        "Astro con generación estática y cero JavaScript por defecto",
        "Componentes reutilizables para las fichas de trabajo",
        "Build y despliegue en contenedor Docker",
      ],
      decisions: [
        "Estático frente a SPA: mejor Core Web Vitals sin servidor de por medio",
        "Imágenes servidas desde el pipeline de assets, no desde carpetas públicas",
        "Fuente de contenido desacoplada del markup para iterar rápido",
      ],
    },
  },
  {
    title: "Este portafolio",
    kicker: "Astro + GSAP + Lenis",
    description:
      "El sitio que estás viendo: una experiencia de una sola página con animaciones, scroll suave y una interfaz diseñada a medida. Código abierto.",
    github: "https://github.com/JulianD3v/julianquintero",
    imageAlt: "Captura de este portafolio personal",
    tags: [{ name: "Astro" }, { name: "GSAP" }, { name: "Tailwind" }],
    detail: {
      role: "Diseño, desarrollo y código abierto",
      year: "2026",
      architecture: [
        "Astro 4 con scripts de movimiento cargados de forma diferida",
        "GSAP + ScrollTrigger para las animaciones ligadas al scroll",
        "Lenis para el scroll suave y la paleta de comandos Cmd + K",
      ],
      decisions: [
        "Imágenes y tipografías auto-hospedadas y precargadas para conseguir CLS = 0",
        "El paquete de animación se descarga después del primer pintado: el sitio se ve y se navega sin esperar a GSAP",
        "Animaciones desactivadas por completo con prefers-reduced-motion",
      ],
    },
  },
] as const satisfies readonly Project[]

export const stack = [
  {
    title: "Frontend",
    items: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Angular", icon: "angular" },
      { name: "Astro", icon: "astro" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Laravel", icon: "laravel" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Java", icon: "java" },
      { name: "WordPress", icon: "wordpress" },
    ],
  },
  {
    title: "Datos e infraestructura",
    items: [
      { name: "MySQL", icon: "mysql" },
      { name: "Docker", icon: "docker" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "vscode" },
    ],
  },
] as const

export const learning = [
  { name: "TypeScript", icon: "typescript" },
  { name: "Tailwind CSS", icon: "tailwind" },
  { name: ".NET", icon: "dotnet" },
] as const

export const contact = {
  kicker: "Contacto",
  title: "¿Construimos algo?",
  lead: "Estoy disponible para proyectos freelance, colaboraciones y oportunidades de trabajo. Cuéntame qué tienes en mente y te respondo en menos de 24 horas.",
} as const
