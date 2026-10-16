export function initPlanificacion() {
    // 1. Control de pestañas principales de la Torre de Control
    const tabsContainer = document.querySelector(".torre-tabs");
    if (tabsContainer) {
        tabsContainer.addEventListener("click", (e) => {
            const clickedTab = e.target.closest(".torre-tab");
            if (!clickedTab) return;
            const targetId = clickedTab.getAttribute("data-target");
            document.querySelectorAll(".torre-tab").forEach(tab => {
                tab.style.color = "var(--muted)";
                tab.style.borderBottom = "none";
                tab.style.paddingBottom = "0";
            });
            clickedTab.style.color = "var(--green)";
            clickedTab.style.borderBottom = "2px solid var(--green)";
            clickedTab.style.paddingBottom = "10px";

            document.querySelectorAll(".torre-content").forEach(content => {
                content.style.display = "none";
            });
            const activeContent = document.getElementById(targetId);
            if (activeContent) {
                activeContent.style.display = "block";
            }
        });
    }

    // 2. Control de sub-pestañas internas de Inventario
    const invSubtabsContainer = document.querySelector(".inventario-subtabs");
    if (invSubtabsContainer) {
        invSubtabsContainer.addEventListener("click", (e) => {
            const clickedSubtab = e.target.closest(".inv-subtab");
            if (!clickedSubtab) return;
            const targetSubId = clickedSubtab.getAttribute("data-inv-target");
            document.querySelectorAll(".inv-subtab").forEach(sub => {
                sub.style.color = "var(--muted)";
                sub.style.borderBottom = "none";
                sub.style.paddingBottom = "0";
            });
            clickedSubtab.style.color = "var(--green)";
            clickedSubtab.style.borderBottom = "2px solid var(--green)";
            clickedSubtab.style.paddingBottom = "10px";
            document.querySelectorAll(".inv-subcontent").forEach(content => {
                content.style.display = "none";
            });
            const activeSubContent = document.getElementById(targetSubId);
            if (activeSubContent) {
                activeSubContent.style.display = "block";
            }
        });
    }

    // 3. Funcionalidad del botón "+ Nuevo ítem": Crea un cuadro estilo Jira dinámicamente
    // 3. Funcionalidad del botón "+ Nuevo ítem" e input interactivo estilo Jira
    const btnNuevoItem = document.getElementById("btnNuevoItem");
    if (btnNuevoItem) {
        btnNuevoItem.addEventListener("click", () => {
            const jiraContainer = document.getElementById("jira-blocks-container");
            if (!jiraContainer) return;

            // Evitamos que se acumulen múltiples inputs de creación abiertos
            if (document.getElementById("input-creacion-lote")) return;

            // Creamos una fila de entrada rápida (estilo Jira)
            const inputWrapper = document.createElement("div");
            inputWrapper.id = "input-creacion-lote";
            inputWrapper.style.cssText = "background: rgba(10, 32, 31, 0.9); border: 1px dashed var(--green); border-radius: 12px; padding: 14px; margin-top: 10px; display: flex; gap: 10px; align-items: center;";

            inputWrapper.innerHTML = `
               <input type="text" id="nombreNuevoLote" placeholder="Escribe el nombre del lote o categoría de inventario..." style="flex: 1; background: #071a1b; border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; color: var(--text); font-size: 13px; outline: none;" autofocus>
               <button id="btnGuardarLote" class="btn-primary-action" style="padding: 6px 14px; font-size: 12px;">Guardar</button>
               <button id="btnCancelarLote" class="btn-secondary-action" style="padding: 6px 10px; font-size: 12px;">✕</button>
           `;

            jiraContainer.appendChild(inputWrapper);

            const inputField = document.getElementById("nombreNuevoLote");
            const btnGuardar = document.getElementById("btnGuardarLote");
            const btnCancelar = document.getElementById("btnCancelarLote");

            // Función para procesar y guardar el nuevo bloque
            const guardarBloque = () => {
                const nombreLote = inputField.value.trim();
                if (!nombreLote) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campo vacío',
                        text: 'Por favor asigna un nombre al bloque de inventario.',
                        background: '#0a2220',
                        color: '#f6f8f8',
                        confirmButtonColor: '#baff36'
                    });
                    return;
                }

                inputWrapper.remove();
                crearBloqueInventarioJira(nombreLote, jiraContainer);
            };

            btnGuardar.addEventListener("click", guardarBloque);
            inputField.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    guardarBloque();
                } else if (e.key === "Escape") {
                    inputWrapper.remove();
                }
            });
            btnCancelar.addEventListener("click", () => inputWrapper.remove());
        });
    }

    // Cargar datos iniciales
    cargarDatosTorreControl();
}
function crearBloqueInventarioJira(nombreLote, contenedor) {
    const nuevoBloque = document.createElement("div");
    nuevoBloque.style.cssText = "background: rgba(10, 32, 31, 0.7); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 15px;";

    nuevoBloque.innerHTML = `
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px;">
           <div style="display: flex; gap: 12px; align-items: center;">
               <strong class="titulo-bloque-lote" style="font-size: 14px; color: var(--text); cursor: pointer;" title="Haz clic para gestionar">${nombreLote}</strong>
               <span class="contador-items" style="color: var(--muted); font-size: 12px;">(0 ítems)</span>
               <span style="background: rgba(186,255,54,0.15); color: var(--green); padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">Planificado</span>
           </div>
           <button class="btn-secondary-action btn-gestionar-lote" style="padding: 4px 10px; font-size: 11px;">Gestionar módulo</button>
       </div>

       <!-- Contenedor interno donde se listarán los elementos creados -->
       <div class="lista-items-internos" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; min-height: 40px; padding: 10px; border: 1px dashed var(--border); border-radius: 8px;">
           <span class="placeholder-vacio" style="color: var(--muted); font-size: 12px; text-align: center; padding: 10px;">Este espacio está vacío. Haz clic en "+ Crear" para agregar elementos.</span>
       </div>

       <!-- Botón interno pequeño estilo Jira para agregar -->
       <div>
           <button class="btn-agregar-item-interno" style="background: transparent; border: none; color: var(--green); font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 4px 0;">
               + Crear
           </button>
       </div>
   `;

    // Referencias a elementos internos
    const listaInterna = nuevoBloque.querySelector(".lista-items-internos");
    const btnAgregarInterno = nuevoBloque.querySelector(".btn-agregar-item-interno");
    const contadorSpan = nuevoBloque.querySelector(".contador-items");
    const tituloLote = nuevoBloque.querySelector(".titulo-bloque-lote");
    const btnGestionar = nuevoBloque.querySelector(".btn-gestionar-lote");

    let itemsCount = 0;

    // Abrir menú lateral al hacer clic en el título o en gestionar
    tituloLote.addEventListener("click", () => abrirMenuLateralInventario(nombreLote));
    btnGestionar.addEventListener("click", () => abrirMenuLateralInventario(nombreLote));

    // Lógica del botón "+ Crear" dentro del cuadro grande
    btnAgregarInterno.addEventListener("click", () => {
        if (nuevoBloque.querySelector(".input-subitem-creacion")) return;

        const inputRow = document.createElement("div");
        inputRow.className = "input-subitem-creacion";
        inputRow.style.cssText = "display: flex; gap: 8px; align-items: center; margin-top: 4px;";
        inputRow.innerHTML = `
           <input type="text" placeholder="Nombre del ítem o producto..." style="flex: 1; background: #071a1b; border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; color: var(--text); font-size: 12px; outline: none;" autofocus>
           <button class="btn-primary-action btn-guardar-sub" style="padding: 4px 10px; font-size: 11px;">Guardar</button>
           <button class="btn-secondary-action btn-cancelar-sub" style="padding: 4px 8px; font-size: 11px;">✕</button>
       `;

        listaInterna.appendChild(inputRow);

        const inputSub = inputRow.querySelector("input");
        const btnGuardarSub = inputRow.querySelector(".btn-guardar-sub");
        const btnCancelarSub = inputRow.querySelector(".btn-cancelar-sub");

        const guardarSubItem = () => {
            const nombreSub = inputSub.value.trim();
            if (!nombreSub) return;

            // Quitamos el placeholder si es el primer elemento
            const placeholder = listaInterna.querySelector(".placeholder-vacio");
            if (placeholder) placeholder.remove();

            inputRow.remove();
            itemsCount++;
            contadorSpan.textContent = `(${itemsCount} ${itemsCount === 1 ? 'ítem' : 'ítems'})`;

            // Creamos el elemento visual dentro del cuadro
            const itemElement = document.createElement("div");
            itemElement.style.cssText = "background: rgba(7, 26, 25, 0.8); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
            itemElement.innerHTML = `
               <span style="color: var(--text); font-weight: 500;">✓ ${nombreSub}</span>
               <span style="color: var(--green); font-size: 11px; font-weight: 600;">Activo</span>
           `;

            // Al hacer clic en el ítem creado también se puede desplegar detalles
            itemElement.addEventListener("click", () => abrirMenuLateralInventario(nombreSub));
            listaInterna.appendChild(itemElement);
        };

        btnGuardarSub.addEventListener("click", guardarSubItem);
        inputSub.addEventListener("keydown", (e) => {
            if (e.key === "Enter") guardarSubItem();
            if (e.key === "Escape") inputRow.remove();
        });
        btnCancelarSub.addEventListener("click", () => inputRow.remove());
    });

    contenedor.appendChild(nuevoBloque);
}

function abrirMenuLateralInventario(nombreTitulo) {
    let drawer = document.getElementById("drawerInventarioJira");
    if (!drawer) {
        drawer = document.createElement("div");
        drawer.id = "drawerInventarioJira";
        drawer.className = "drawer-detalle";

        // Agregamos una barra de agarre a la izquierda para redimensionar
        const resizer = document.createElement("div");
        resizer.id = "drawerResizer";
        resizer.style.cssText = "position: absolute; top: 0; left: 0; width: 6px; height: 100%; cursor: ew-resize; background: transparent; z-index: 101;";
        drawer.appendChild(resizer);

        // Lógica para arrastrar y cambiar de tamaño
        let isResizing = false;
        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", () => {
                isResizing = false;
                document.removeEventListener("mousemove", handleMouseMove);
            });
        });

        function handleMouseMove(e) {
            if (!isResizing) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 350 && newWidth < window.innerWidth - 100) {
                drawer.style.width = newWidth + "px";
            }
        }

        document.body.appendChild(drawer);
    }

    // Contenido interno del drawer
    // Buscamos o inyectamos el contenedor de contenido dentro del drawer para no pisar el resizer
    let contentContainer = document.getElementById("drawerContentInner");
    if (!contentContainer) {
        contentContainer = document.createElement("div");
        contentContainer.id = "drawerContentInner";
        contentContainer.style.cssText = "padding: 30px; height: 100%; overflow-y: auto;";
        drawer.appendChild(contentContainer);
    }

    contentContainer.innerHTML = `
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
           <div>
               <span style="font-size: 11px; color: var(--green); font-weight: 700; text-transform: uppercase;">Gestión de Inventario / Lote</span>
               <h2 style="font-size: 20px; font-weight: 800; margin: 4px 0 0 0; color: var(--text);">${nombreTitulo}</h2>
           </div>
           <button id="cerrarDrawer" style="background: transparent; border: none; color: var(--muted); font-size: 18px; cursor: pointer;">✕</button>
       </div>
       
       <div style="background: rgba(186,255,54,0.05); border: 1px solid var(--green); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
           <h4 style="margin: 0 0 8px 0; color: var(--green); font-size: 14px;">🚀 Herramienta en Desarrollo</h4>
           <p style="margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5;">
               Próximamente esta herramienta avanzada de inventarios estará disponible. Podrás realizar control de stock en tiempo real, escaneo de códigos, asignación de ubicaciones físicas y auditorías por usuario.
           </p>
       </div>

       <div style="font-size: 13px; color: var(--muted); margin-bottom: 10px;">Detalles del entorno:</div>
       <div style="background: rgba(10, 32, 31, 0.5); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
           <div><strong>Estado:</strong> Sincronizado con servidor</div>
           <div><strong>Permisos:</strong> Dinámicos por Espacio de Trabajo</div>
           <div><strong>Seguridad:</strong> Token UTC activo</div>
       </div>
   `;

    drawer.style.display = "block";

    document.getElementById("cerrarDrawer").addEventListener("click", () => {
        drawer.style.display = "none";
    });
}

async function cargarDatosTorreControl() {
    const kpisContainer = document.getElementById("kpis-container");
    const tablaBody = document.getElementById("tabla-inventario-body");
    try {
        setTimeout(() => {
            const dataKpis = [
                { titulo: "Nivel de servicio", valor: "96,4%", tendencia: "+1,2 pts vs. mes anterior", positivo: true },
                { titulo: "Rotación de inventario", valor: "8,2x", tendencia: "+0,4 vs. mes anterior", positivo: true },
                { titulo: "Cobertura promedio", valor: "34 días", tendencia: "-3 días vs. mes anterior", positivo: false },
                { titulo: "Exactitud de inventario", valor: "98,7%", tendencia: "+0,3 pts vs. mes anterior", positivo: true }
            ];
            const dataInventario = [
                { sku: "LX-0041", producto: "Caja corrugada 40×30", bodega: "Norte · A-03-2", disponible: 1240, reservado: 310, cobertura: "41 d", estado: "Disponible" },
                { sku: "LX-0112", producto: "Estiba plástica 1200×1000", bodega: "Sur · C-01-1", disponible: 38, reservado: 30, cobertura: "9 d", estado: "Stock bajo" },
                { sku: "LX-0207", producto: "Film stretch 500 mm", bodega: "Norte · B-02-4", disponible: 6, reservado: 6, cobertura: "2 d", estado: "Crítico" }
            ];
            if (kpisContainer) {
                kpisContainer.innerHTML = dataKpis.map(kpi => `
                   <div class="kpi-card">
                       <p class="kpi-title">${kpi.titulo}</p>
                       <h3 class="kpi-value">${kpi.valor}</h3>
                       <span class="${kpi.positivo ? 'kpi-trend-positive' : 'kpi-trend-negative'}">${kpi.tendencia}</span>
                   </div>
               `).join('');
            }
            if (tablaBody) {
                tablaBody.innerHTML = dataInventario.map(item => `
                   <tr style="border-bottom: 1px solid var(--border); cursor: pointer;" onmouseover="this.style.background='rgba(186,255,54,0.03)'" onmouseout="this.style.background='transparent'">
                       <td style="padding: 12px 16px; color: var(--green); font-weight: 700;">${item.sku}</td>
                       <td style="padding: 12px 16px; font-weight: 600;">${item.producto}</td>
                       <td style="padding: 12px 16px; color: var(--muted);">${item.bodega}</td>
                       <td style="padding: 12px 16px;">${item.disponible}</td>
                       <td style="padding: 12px 16px;">${item.reservado}</td>
                       <td style="padding: 12px 16px;">${item.cobertura}</td>
                       <td style="padding: 12px 16px;">
                           <span style="background: ${item.estado === 'Disponible' ? 'rgba(186,255,54,0.15)' : 'rgba(255,170,0,0.15)'}; color: ${item.estado === 'Disponible' ? 'var(--green)' : '#ffaa00'}; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700;">
                               ${item.estado}
                           </span>
                       </td>
                   </tr>
               `).join('');
            }
        }, 500);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
    // Hace que cualquier bloque existente (incluyendo Inventario General) active el botón "+ Crear" y el menú lateral
    document.querySelectorAll("#jira-blocks-container > div").forEach(bloque => {
        const titulo = bloque.querySelector(".titulo-bloque-lote");
        const btnGestionar = bloque.querySelector(".btn-gestionar-lote");
        const btnAgregar = bloque.querySelector(".btn-agregar-item-interno");
        const listaInterna = bloque.querySelector(".lista-items-internos");
        const contadorSpan = bloque.querySelector(".contador-items");

        if (titulo && !titulo.dataset.listener) {
            titulo.dataset.listener = "true";
            const nombreLote = titulo.textContent.trim();
            titulo.addEventListener("click", () => abrirMenuLateralInventario(nombreLote));
            if (btnGestionar) btnGestionar.addEventListener("click", () => abrirMenuLateralInventario(nombreLote));

            if (btnAgregar && listaInterna) {
                let itemsCount = listaInterna.querySelectorAll("div").length;
                btnAgregar.addEventListener("click", () => {
                    if (bloque.querySelector(".input-subitem-creacion")) return;

                    const inputRow = document.createElement("div");
                    inputRow.className = "input-subitem-creacion";
                    inputRow.style.cssText = "display: flex; gap: 8px; align-items: center; margin-top: 4px;";
                    inputRow.innerHTML = `
                       <input type="text" placeholder="Nombre del ítem o producto..." style="flex: 1; background: #071a1b; border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; color: var(--text); font-size: 12px; outline: none;" autofocus>
                       <button class="btn-primary-action btn-guardar-sub" style="padding: 4px 10px; font-size: 11px;">Guardar</button>
                       <button class="btn-secondary-action btn-cancelar-sub" style="padding: 4px 8px; font-size: 11px;">✕</button>
                   `;

                    listaInterna.appendChild(inputRow);

                    const inputSub = inputRow.querySelector("input");
                    const btnGuardarSub = inputRow.querySelector(".btn-guardar-sub");
                    const btnCancelarSub = inputRow.querySelector(".btn-cancelar-sub");

                    const guardarSubItem = () => {
                        const nombreSub = inputSub.value.trim();
                        if (!nombreSub) return;

                        inputRow.remove();
                        itemsCount++;
                        contadorSpan.textContent = `(${itemsCount} ${itemsCount === 1 ? 'ítem' : 'ítems'})`;

                        const itemElement = document.createElement("div");
                        itemElement.style.cssText = "background: rgba(7, 26, 25, 0.8); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
                        itemElement.innerHTML = `
                           <span style="color: var(--text); font-weight: 500;">✓ ${nombreSub}</span>
                           <span style="color: var(--green); font-size: 11px; font-weight: 600;">Activo</span>
                       `;
                        itemElement.addEventListener("click", () => abrirMenuLateralInventario(nombreSub));
                        listaInterna.appendChild(itemElement);
                    };

                    btnGuardarSub.addEventListener("click", guardarSubItem);
                    inputSub.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") guardarSubItem();
                        if (e.key === "Escape") inputRow.remove();
                    });
                    btnCancelarSub.addEventListener("click", () => inputRow.remove());
                });
            }
        }
    });
}