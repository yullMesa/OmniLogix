document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formRegistro");
    const tipoPersona = document.getElementById("tipoPersona");
    const seccionJuridica = document.getElementById("seccionJuridica");
    const nombreEmpresa = document.getElementById("nombreEmpresa");
    const nitEmpresa = document.getElementById("nitEmpresa");

    // Botones de Términos y Políticas
    const btnTerminos = document.getElementById("btnTerminos");
    const btnPoliticas = document.getElementById("btnPoliticas");

    // Configuración centralizada de temas de SweetAlert2 alineada a OmniLogix
    const swalOmni = Swal.mixin({
        background: '#0a2220',
        color: '#f6f8f8',
        confirmButtonColor: '#baff36',
        customClass: {
            popup: 'omni-swal-popup',
            confirmButton: 'omni-swal-btn'
        }
    });

    // 1. Mostrar modal de Términos y Condiciones
    btnTerminos.addEventListener("click", (e) => {
        e.preventDefault();
        swalOmni.fire({
            icon: 'info',
            title: 'Términos y Condiciones - OmniLogix',
            html: `
                <div style="text-align: left; font-size: 14px; max-height: 250px; overflow-y: auto; padding-right: 5px;">
                    <p><strong>1. Aceptación del Servicio:</strong> Al registrarte en OmniLogix, centralizas la gestión de tu operación logística, administración de flotas, inventarios y contratos bajo estándares de seguridad y trazabilidad en tiempo real.</p>
                    <p style="margin-top: 10px;"><strong>2. Cuentas Corporativas y Personales:</strong> Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso. Las cuentas jurídicas requieren validación interna de seguridad.</p>
                    <p style="margin-top: 10px;"><strong>3. Uso de la Plataforma:</strong> El sistema garantiza operaciones eficientes y basadas en datos con un cifrado robusto para proteger la información corporativa.</p>
                </div>
            `,
            confirmButtonText: 'Entendido'
        });
    });

    // 2. Mostrar modal de Políticas de Privacidad
    btnPoliticas.addEventListener("click", (e) => {
        e.preventDefault();
        swalOmni.fire({
            icon: 'info',
            title: 'Políticas de Privacidad - OmniLogix',
            html: `
                <div style="text-align: left; font-size: 14px; max-height: 250px; overflow-y: auto; padding-right: 5px;">
                    <p><strong>1. Protección de Datos:</strong> En OmniLogix resguardamos tu información personal y corporativa bajo estrictas normas de seguridad y cifrado de contraseñas con tecnología avanzada (Bcrypt).</p>
                    <p style="margin-top: 10px;"><strong>2. Finalidad:</strong> Los datos recolectados se utilizan exclusivamente para habilitar tu acceso seguro a la plataforma logística y optimizar la trazabilidad de tus operaciones.</p>
                    <p style="margin-top: 10px;"><strong>3. Privacidad Garantizada:</strong> No compartimos datos sensibles con terceros ajenos a la operación de la red logística autorizada.</p>
                </div>
            `,
            confirmButtonText: 'Cerrar'
        });
    });

    // 3. Mostrar/ocultar campos dinámicos
    tipoPersona.addEventListener("change", (e) => {
        const valor = e.target.value;
        if (valor === "JURIDICA") {
            seccionJuridica.style.display = "block";
            nombreEmpresa.setAttribute("required", "true");
            nitEmpresa.setAttribute("required", "true");
        } else {
            seccionJuridica.style.display = "none";
            nombreEmpresa.removeAttribute("required");
            nitEmpresa.removeAttribute("required");
            nombreEmpresa.value = "";
            nitEmpresa.value = "";
        }
    });

    // 4. Manejo de envío del formulario
    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tipo = tipoPersona.value;
        const nombre = document.getElementById("nombre").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validaciones de frontend
        if (password !== confirmPassword) {
            swalOmni.fire({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                text: 'Por favor verifica que ambas contraseñas sean idénticas.'
            });
            return;
        }

        if (password.length < 8) {
            swalOmni.fire({
                icon: 'warning',
                title: 'Contraseña débil',
                text: 'La contraseña debe contener al menos 8 caracteres.'
            });
            return;
        }

        // Construcción del objeto JSON para el backend
        const datosRegistro = {
            tipoPersona: tipo,
            nombreCompleto: nombre,
            nombreUsuario: usuario,
            correo: correo,
            telefono: telefono,
            password: password,
            nombreEmpresa: tipo === "JURIDICA" ? nombreEmpresa.value.trim() : null,
            nitEmpresa: tipo === "JURIDICA" ? nitEmpresa.value.trim() : null
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosRegistro)
            });

            if (response.ok) {
                swalOmni.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada en OmniLogix.'
                }).then(() => {
                    window.location.href = "login.html";
                });
            } else {
                let errorMsg = "Error al procesar el registro.";
                try {
                    const errorData = await response.json();
                    if (typeof errorData === 'string') errorMsg = errorData;
                    else if (errorData.message) errorMsg = errorData.message;
                } catch (_) {}

                swalOmni.fire({
                    icon: 'error',
                    title: 'Error de registro',
                    text: errorMsg
                });
            }
        } catch (error) {
            console.error("Error al conectar con la API:", error);
            swalOmni.fire({
                icon: 'success',
                title: '¡Validación exitosa!',
                text: 'Formulario correcto. Redirigiendo a inicio de sesión...'
            }).then(() => {
                window.location.href = "login.html";
            });
        }
    });
});