document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const identifierInput = document.getElementById("identifier");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePassword");

    // Configuración de SweetAlert2 con la paleta de colores de OmniLogix
    const swalOmni = Swal.mixin({
        background: '#0a2220',
        color: '#f6f8f8',
        confirmButtonColor: '#baff36',
        customClass: {
            popup: 'omni-swal-popup',
            confirmButton: 'omni-swal-btn'
        }
    });

    // 1. Funcionalidad para mostrar/ocultar contraseña
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePasswordBtn.textContent = type === "password" ? "Mostrar" : "Ocultar";
            togglePasswordBtn.setAttribute("aria-pressed", type === "text");
        });
    }

    // 2. Manejo del envío del formulario de inicio de sesión
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        if (!identifier || !password) {
            swalOmni.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor ingresa tu usuario/correo y contraseña.'
            });
            return;
        }

        const credenciales = {
            identifier: identifier,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credenciales)
            });

            if (response.ok) {
                const usuarioLogueado = await response.json();

                // Guardar datos básicos en sessionStorage para usarlos en el dashboard
                sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioLogueado));

                swalOmni.fire({
                    icon: 'success',
                    title: '¡Bienvenido de nuevo!',
                    text: `Acceso concedido. Redirigiendo al panel...`
                }).then(() => {
                    // Redirige estrictamente al dashboard
                    window.location.href = "dashboard.html";
                });
            } else {
                let errorMsg = "Credenciales incorrectas.";
                try {
                    const errorText = await response.text();
                    if (errorText) errorMsg = errorText;
                } catch (_) {}

                swalOmni.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: errorMsg
                });
            }
        } catch (error) {
            console.error("Error de conexión con el backend:", error);

            swalOmni.fire({
                icon: 'error',
                title: 'Error de servidor',
                text: 'No se pudo conectar con el servidor de autenticación. Verifica que Java esté encendido.'
            });
        }
    });
});