document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const mainContent = document.getElementById("mainContent");
    const breadcrumb = document.getElementById("breadcrumb");
    const sidebar = document.getElementById("sidebar");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const menuToggle = document.getElementById("menuToggle");

    // Definición de las plantillas de contenido para cada vista de la SPA
    const views = {
        inicio: {
            title: "Inicio",
            breadcrumb: "Inicio",
            content: `
                <section class="welcome" aria-labelledby="viewTitle">
                    <div class="welcome-icon" aria-hidden="true">∞</div>
                    <p class="eyebrow">BIENVENIDO A OMNILOGIX</p>
                    <h1 id="viewTitle">El futuro de tu logística <span class="accent">comienza aquí.</span></h1>
                    <p class="welcome-description">
                        Estamos construyendo un espacio para conectar y gestionar tus planes,
                        organización, contratos y operaciones desde un solo lugar.
                    </p>
                    <div class="future-notice" role="status">
                        <span class="notice-dot" aria-hidden="true"></span>
                        <span>Selecciona una opción en el menú lateral para desplegar tu herramienta de gestión.</span>
                    </div>
                </section>
            `
        },
        planificacion: {
            title: "Planificación",
            breadcrumb: "Planificación",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">MÓDULO 01</p>
                        <h2>Planificación Operativa y <span class="accent">Tabla Maestra</span></h2>
                        <p class="view-subtitle">Define tus parámetros iniciales, carga de datos y procesa tu información.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>🛠️ Aquí cargaremos próximamente el formulario de las 3 preguntas y la tabla tipo Excel (Tabulator).</p>
                    </div>
                </div>
            `
        },
        organizacion: {
            title: "Organización",
            breadcrumb: "Organización",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">MÓDULO 02</p>
                        <h2>Gestión de <span class="accent">Equipos y Terceros</span></h2>
                        <p class="view-subtitle">Asigna roles, personal interno y outsourcing para ejecutar la operación.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>👥 Aquí cargaremos próximamente el módulo de asignación de recursos humanos.</p>
                    </div>
                </div>
            `
        },
        distribucion: {
            title: "Distribución",
            breadcrumb: "Distribución",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">MÓDULO 03</p>
                        <h2>Canales y <span class="accent">Estrategia de Salida</span></h2>
                        <p class="view-subtitle">Define distribución digital, flotas de vehículos (carros/motos) y estrategia comercial.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>🚚 Aquí cargaremos próximamente el selector de canales de distribución y vehículos.</p>
                    </div>
                </div>
            `
        },
        contratos: {
            title: "Contratos",
            breadcrumb: "Contratos",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">MÓDULO 04</p>
                        <h2>Generación de <span class="accent">Contratos y Tokens</span></h2>
                        <p class="view-subtitle">Crea documentos legales oficiales en PDF vinculados a tus metas de planificación.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>📄 Aquí cargaremos próximamente el generador de contratos oficiales y firmas digitales.</p>
                    </div>
                </div>
            `
        },
        seguimiento: {
            title: "Seguimiento",
            breadcrumb: "Seguimiento",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">MÓDULO 05</p>
                        <h2>Tablero Kanban <span class="accent">de Control y SLAs</span></h2>
                        <p class="view-subtitle">Supervisa el avance por fechas y el cumplimiento de los contratos activos.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>🎯 Aquí cargaremos próximamente el Kanban dinámico atado a fechas y alertas de tokens.</p>
                    </div>
                </div>
            `
        },
        configuracion: {
            title: "Configuración",
            breadcrumb: "Configuración",
            content: `
                <div class="view-container">
                    <div class="view-header">
                        <p class="eyebrow">SISTEMA</p>
                        <h2>Ajustes de <span class="accent">Plataforma</span></h2>
                        <p class="view-subtitle">Gestiona las preferencias de tu cuenta y entorno de trabajo.</p>
                    </div>
                    <div class="tool-placeholder">
                        <p>⚙️ Configuración general del sistema.</p>
                    </div>
                </div>
            `
        }
    };

    // Función para cambiar de vista de forma fluida
    function loadView(viewKey) {
        const targetView = views[viewKey] || views.inicio;

        // Inyectar contenido en el main
        mainContent.innerHTML = targetView.content;
        breadcrumb.textContent = targetView.breadcrumb;

        // Actualizar clases activas en el menú
        navLinks.forEach(link => {
            if (link.getAttribute("data-view") === viewKey) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("is-active");
                link.removeAttribute("aria-current");
            }
        });

        // En pantallas móviles, cerrar el sidebar automáticamente al seleccionar una opción
        if (window.innerWidth <= 860) {
            sidebar.classList.remove("is-open");
            sidebarBackdrop.hidden = true;
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    // Escuchar clics en los enlaces del sidebar
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const viewKey = link.getAttribute("data-view");
            loadView(viewKey);
            // Opcional: actualizar el hash en la URL sin recargar
            history.pushState({ view: viewKey }, "", `#${viewKey}`);
        });
    });

    // Manejar botones de menú móvil (hamburguesa y backdrop)
    if (menuToggle && sidebar && sidebarBackdrop) {
        menuToggle.addEventListener("click", () => {
            const isOpen = sidebar.classList.toggle("is-open");
            sidebarBackdrop.hidden = !isOpen;
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        sidebarBackdrop.addEventListener("click", () => {
            sidebar.classList.remove("is-open");
            sidebarBackdrop.hidden = true;
            menuToggle.setAttribute("aria-expanded", "false");
        });
    }

    // Cargar la vista inicial basada en el hash de la URL (si recarga o entra directo con un enlace)
    window.addEventListener("popstate", () => {
        const hash = window.location.hash.replace("#", "") || "inicio";
        loadView(hash);
    });

    // Inicializar según el hash actual al cargar la página
    const initialHash = window.location.hash.replace("#", "") || "inicio";
    loadView(initialHash);
});