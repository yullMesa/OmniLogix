document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("mainContent");
    const breadcrumb = document.getElementById("breadcrumb");
    const navLinks = document.querySelectorAll(".nav-link");

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    const titulosSeccion = {
        "inicio": "Inicio",
        "planificacion": "Planificación",
        "organizacion": "Organización",
        "distribucion": "Distribución",
        "contratos": "Contratos",
        "seguimiento": "Seguimiento"
    };

    const cargarVista = async (nombreVista) => {
        try {
            // Ruta absoluta desde la raíz del servidor web local para evitar errores 404
            const respuesta = await fetch(`/OmniLogix/Frontend/pages/views/${nombreVista}.html`);
            if (!respuesta.ok) throw new Error("No se pudo cargar la vista.");

            const htmlContenido = await respuesta.text();
            mainContent.innerHTML = htmlContenido;

            if (breadcrumb) {
                breadcrumb.textContent = titulosSeccion[nombreVista] || "Panel";
            }

            // Cargador dinámico del script específico para planificación
            if (nombreVista === "planificacion") {
                import('../vanilla/views/planificacion.js')
                    .then(modulo => {
                        if (modulo && modulo.initPlanificacion) {
                            modulo.initPlanificacion();
                        }
                    })
                    .catch(err => console.log("Aviso: Vista cargada sin script dedicado.", err));
            }

        } catch (error) {
            console.error("Error al cargar la SPA:", error);
            mainContent.innerHTML = `
                <section class="welcome" style="text-align: center; padding: 40px;">
                    <h2 style="color: #ff6b6b; margin-bottom: 10px;">Módulo en construcción</h2>
                    <p style="color: var(--muted);">No se pudo encontrar el archivo de la vista (${nombreVista}.html).</p>
                </section>
            `;
        }
    };

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const vistaDestino = link.getAttribute("data-view");
            if (!vistaDestino) return;

            navLinks.forEach(l => l.classList.remove("is-active"));
            link.classList.add("is-active");

            cargarVista(vistaDestino);

            if (window.innerWidth <= 850 && sidebar) {
                sidebar.classList.remove("is-open");
                if (sidebarBackdrop) sidebarBackdrop.hidden = true;
                if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

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
});