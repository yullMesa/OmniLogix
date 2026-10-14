document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const selectTipoPersona = document.getElementById("tipoPersona");
    const seccionJuridica = document.getElementById("seccionJuridica");

    const btnTerminos = document.getElementById("btnTerminos");
    const btnPoliticas = document.getElementById("btnPoliticas");

    // Mostrar/ocultar campos de empresa
    if (selectTipoPersona) {
        selectTipoPersona.addEventListener("change", (e) => {
            seccionJuridica.style.display = (e.target.value === "JURIDICA") ? "block" : "none";
        });
    }

    // Modal de Términos y Condiciones
    if (btnTerminos) {
        btnTerminos.addEventListener("click", (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Términos y Condiciones',
                html: `
                    <p><strong>1. Uso de la Plataforma:</strong> OmniLogix proporciona servicios B2B para la gestión operativa y de inventarios.</p>
                    <p><strong>2. Cuentas Corporativas:</strong> Las cuentas registradas como Persona Jurídica requieren un proceso de verificación interna previa autorización de permisos.</p>
                    <p><strong>3. Responsabilidad:</strong> El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</p>
                `,
                customClass: {
                    popup: 'swal-dark-theme',
                    confirmButton: 'swal-btn-confirm'
                },
                confirmButtonText: 'Entendido'
            });
        });
    }

    // Modal de Políticas de Privacidad
    if (btnPoliticas) {
        btnPoliticas.addEventListener("click", (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Política de Privacidad',
                html: `
                    <p><strong>Tratamiento de Datos:</strong> En cumplimiento de la regulación aplicable, OmniLogix protege los datos personales y empresariales recolectados.</p>
                    <p><strong>Seguridad:</strong> La información almacenada se encuentra cifrada y no será compartida con terceros sin autorización explícita.</p>
                `,
                customClass: {
                    popup: 'swal-dark-theme',
                    confirmButton: 'swal-btn-confirm'
                },
                confirmButtonText: 'Aceptar'
            });
        });
    }

    // Envío del Formulario
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Contraseña',
                text: 'Las contraseñas no coinciden.',
                customClass: { popup: 'swal-dark-theme', confirmButton: 'swal-btn-confirm' }
            });
            return;
        }

        const tipoPersona = selectTipoPersona.value;

        const datosRegistro = {
            tipoPersona: tipoPersona,
            nombreCompleto: document.getElementById("nombre").value,
            nombreUsuario: document.getElementById("usuario").value,
            correoCorporativo: document.getElementById("correo").value,
            telefono: document.getElementById("telefono").value,
            password: password,
            nombreEmpresa: tipoPersona === "JURIDICA" ? document.getElementById("nombreEmpresa").value : null,
            nitTributaria: tipoPersona === "JURIDICA" ? document.getElementById("nitEmpresa").value : null,
            estadoAprobacion: tipoPersona === "JURIDICA" ? "PENDIENTE" : "APROBADO"
        };

        try {
            const respuesta = await fetch("http://localhost:8080/api/empresas/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosRegistro)
            });

            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: 'Cuenta creada correctamente en OmniLogix.',
                    customClass: { popup: 'swal-dark-theme', confirmButton: 'swal-btn-confirm' }
                }).then(() => {
                    window.location.href = "login.html";
                });
            } else {
                const errorTexto = await respuesta.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el Registro',
                    text: errorTexto,
                    customClass: { popup: 'swal-dark-theme', confirmButton: 'swal-btn-confirm' }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión',
                text: 'No se pudo conectar con el backend de OmniLogix.',
                customClass: { popup: 'swal-dark-theme', confirmButton: 'swal-btn-confirm' }
            });
        }
    });
});