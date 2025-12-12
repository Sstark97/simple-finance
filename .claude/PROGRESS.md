# Progreso del Proyecto: Personal Finance Tracker                                        
                                                                                         
## 1. Stack Tecnológico Acordado                                                         
                                                                                         
Se ha acordado el siguiente stack tecnológico para el desarrollo de la aplicación:       
                                                                                         
*   **Framework Principal:** Next.js (versión 16.x.x, la más reciente estable)           
    *   Utilizado tanto para el frontend (React) como para el backend (Next.js API Routes
).                                                                                       
*   **Lenguaje de Programación:** TypeScript                                             
    *   Para garantizar la seguridad de tipos, mantenibilidad y adherencia a buenas práct
icas.                                                                                    
*   **Estilos CSS:** Tailwind CSS (versión 4.x.x, la más reciente estable)               
    *   Para un desarrollo ágil de la interfaz de usuario mobile-first.                  
                                                                                         
## 2. Arquitectura de Software                                                           
                                                                                         
Se adoptará una **Arquitectura Hexagonal** para asegurar una clara separación de responsa
bilidades y facilitar la mantenibilidad, escalabilidad y testabilidad del código. Las cap
as se definirán de la siguiente manera:                                                  
                                                                                         
*   **Domain:** Contendrá las entidades y la lógica de negocio pura, agnóstica a la infra
estructura.                                                                              
*   **Application:** Albergará los casos de uso (`use-cases`) que orquestan la lógica de 
negocio y las interfaces de los repositorios (`repositories interfaces`) que definen los 
contratos para la persistencia de datos.                                                 
*   **Infrastructure:** Incluirá las implementaciones concretas de los adaptadores extern
os, como la comunicación con la API de Google Sheets y las implementaciones de los reposi
torios.                                                                                  
                                                                                         
## 3. Estructura de Carpetas Propuesta                                                   
                                                                                         
La estructura de carpetas del proyecto, alineada con Next.js y la Arquitectura Hexagonal,
 será la siguiente:                                                                      
                                                                                         
```                                                                                      
/src                                                                                     
├── app/                                                                                 
│   ├── api/                                                                             
│   │   └── [...] # Endpoints de Next.js que conectan el frontend con los casos de uso   
│   ├── components/                                                                    
│   │   └── ui/      # Componentes de UI reutilizables (botones, inputs, etc.)           
│   │   └── [...]    # Componentes específicos de cada vista/página                      
│   └── page.tsx     # Página principal (Dashboard) y otras páginas                      
│                                                                                        
├── domain/                                                                              
│   ├── models/                                                                          
│   │   ├── Transaction.ts                                                               
│   │   ├── Dashboard.ts                                                                 
│   │   └── NetWorth.ts                                                                  
│   └── services/                                                                        
│       └── [...] # Lógica de negocio pura si fuera necesaria                            
│                                                                                        
├── application/                                                                         
│   ├── use-cases/                                                                       
│   │   ├── AddTransaction.ts                                                            
│   │   ├── GetCurrentDashboard.ts                                                       
│   │   └── [...] # Resto de casos de uso                                                
│   └── repositories/                                                                    
│       ├── DashboardRepository.ts  # Interfaz                                           
│       ├── TransactionRepository.ts # Interfaz                                          
│       └── NetWorthRepository.ts   # Interfaz                                           
│                                                                                        
└── infrastructure/                                                                      
    ├── google/                                                                          
    │   └── sheetsClient.ts # Configuración y cliente de la API de Google Sheets         
    └── repositories/                                                                    
        ├── GoogleSheetsDashboardRepository.ts  # Implementación                         
        ├── GoogleSheetsTransactionRepository.ts # Implementación                        
        └── GoogleSheetsNetWorthRepository.ts   # Implementación                         
```                                                                                      
                                                                                         
## 4. Próximos Pasos                                                                     
                                                                                         
## 5. Avances Recientes                                                                  
                                                                                         
Se han completado las siguientes fases del proyecto:                                     
                                                                                         
1.  **Configuración Inicial y Dependencias:**                                            
    *   Proyecto Next.js inicializado con TypeScript, ESLint, Tailwind CSS y `pnpm`.     
    *   Configuración de Next.js (incluyendo React Compiler) y gestión de dependencias.  
    *   Estructura de carpetas básica definida.                                          
    *   Configuración de variables de entorno para `SPREADSHEET_ID`.                     
    *   Integración del sistema de diseño de v0.dev (dependencias, configuración de Tailw
indCSS/shadcn/ui, estilos globales, `ThemeProvider`).                                    
                                                                                         
2.  **Arquitectura Hexagonal Implementada:**                                             
    *   Creación de la estructura de carpetas `domain/`, `application/`, `infrastructure/
`.                                                                                       
    *   Implementación de modelos de dominio (`Transaction`, `Dashboard`, `NetWorth`).   
    *   Definición de interfaces de repositorios.                                        
    *   Implementación de casos de uso para las operaciones CRUD principales.            
                                                                                         
3.  **Capa de Datos (Google Sheets API):**                                               
    *   Configuración de la autenticación con la API de Google Sheets mediante cuenta de 
servicio.                                                                                
    *   Implementación de repositorios concretos para Google Sheets (`GoogleSheetsDashboa
rdRepository`, `GoogleSheetsTransactionRepository`, `GoogleSheetsNetWorthRepository`).   
    *   Corrección y robustez en el parseo de fechas para asegurar la correcta lectura y 
escritura de datos.                                                                      
                                                                                         
4.  **API Endpoints (Next.js API Routes):**                                              
    *   Creación de endpoints REST para todas las operaciones definidas (`GET /api/dashbo
ard`, `POST /api/transactions`, `PUT /api/dashboard/settings`, `PUT /api/networth`, `GET 
/api/transactions`, `GET /api/networth`).                                                
                                                                                         
5.  **Interfaz de Usuario (Frontend con v0.dev y React):**                               
    *   Integración de un diseño de UI moderno y elegante generado por v0.dev.           
    *   Implementación del Dashboard principal con componentes visuales avanzados (tarjet
as, gráficos de donut y barras).                                                         
    *   Funcionalidad de selección de mes para visualizar datos históricos.              
    *   Manejo de estados de carga (skeletons) y visualización de un mensaje amigable cua
ndo no hay datos para el mes seleccionado.                                               
    *   Mejoras visuales en los gráficos del dashboard para mayor claridad (ej. Balance e
n el centro del donut, color más vivo para "Disponible para Objetivos").                 
    *   Creación de páginas dedicadas para el "Historial de Gastos" y "Historial de Patri
monio", incluyendo navegación.                                                           
                                                                                         
## 6. Próximos Pasos (Pendientes)                                                        
                                                                                         
1.  **Mejora de la Calidad del Código:**                                                 
    *   Refactorización y limpieza de código existente.                                  
    *   Asegurar la consistencia en el estilo y las convenciones de codificación.        
    *   Revisión de la modularidad y separación de responsabilidades.                    
    *   Implementación de pruebas unitarias y/o de integración donde sea apropiado.
                                                                                         
## 7. Avances Recientes (Continuación)                                                   
                                                                                         
1.  **Refactorización a Server Components (DashboardView):**                             
    *   `DashboardView` convertido a Server Component.                                   
    *   Toda la lógica de obtención de datos (`dashboardData`) se ha movido al servidor, 
utilizando `searchParams` para el mes seleccionado.                                      
    *   Los formularios (`TransactionForm`, `MonthlySettingsForm`, `NetWorthForm`) se han
 extraído como Client Components independientes.                                         
    *   Implementación de Server Actions para `addTransaction`, `updateMonthlySettings` y
 `saveNetWorth`, manejando la validación con Zod y la revalidación de caché con `reval
idatePath`.                                                                             
    *   `DashboardHeader` refactorizado para ser un Client Component y usar `useRouter` p
ara actualizar los `searchParams` de la URL al cambiar el mes.                           
                                                                                         
2.  **Problemas Identificados:**                                                         
    *   **Cambio de Mes No Funcionando Correctamente:** La funcionalidad de cambiar el mes
 en el `DashboardHeader` y que esto actualice los datos del `DashboardView` no está funcio
nando como se esperaba. Se requiere depuración en el Client Component `DashboardHeader` y
 en la propagación de `searchParams` al Server Component `DashboardView`.                 
    *   **Errores TypeScript Pendientes:**                                               
        *   Errores de tipado en `src/app/components/ui/chart.tsx` relacionados con `rec
harts`.                                                                                 
        *   Error de importación en `src/app/components/ui/sidebar.tsx` (falta `SheetDe
scription`).                                                                             
        *   Errores de tipo `unknown` en los catch de las rutas API.                     
        *   Redundancia de `size` en `src/app/components/ui/pagination.tsx`.