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

        const resizer = document.createElement("div");
        resizer.id = "drawerResizer";
        resizer.style.cssText = "position: absolute; top: 0; left: 0; width: 6px; height: 100%; cursor: ew-resize; background: transparent; z-index: 101;";
        drawer.appendChild(resizer);

        let isResizing = false;
        resizer.addEventListener("mousedown", () => {
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
            if (newWidth > 480 && newWidth < window.innerWidth - 100) {
                drawer.style.width = newWidth + "px";
            }
        }
        document.body.appendChild(drawer);
    }

    let contentContainer = document.getElementById("drawerContentInner");
    if (!contentContainer) {
        contentContainer = document.createElement("div");
        contentContainer.id = "drawerContentInner";
        contentContainer.style.cssText = "padding: 24px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box;";
        drawer.appendChild(contentContainer);
    }

    contentContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 12px; flex-shrink: 0;">
          <div>
              <span style="font-size: 11px; color: var(--green); font-weight: 700; text-transform: uppercase;">Gestión de Inventario / Registro</span>
              <h2 style="font-size: 20px; font-weight: 800; margin: 2px 0 0 0; color: var(--text);">Nuevo registro en: ${nombreTitulo}</h2>
          </div>
          <button id="cerrarDrawer" style="background: transparent; border: none; color: var(--muted); font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <!-- Barra superior corregida (Espaciosa y con scroll elegante) -->
      <div class="wizard-tabs-container" id="wizardTabs">
          <button class="wizard-tab-btn active" data-section="sec-tipo">Tipo de ítem</button>
          <button class="wizard-tab-btn" data-section="sec-general">Información general</button>
          <button class="wizard-tab-btn" data-section="sec-disponibilidad">Disponibilidad</button>
          <button class="wizard-tab-btn" data-section="sec-precios">Precios y costos</button>
          <button class="wizard-tab-btn" data-section="sec-proveedor">Proveedor</button>
          <button class="wizard-tab-btn" data-section="sec-logistica">Logística</button>
          <button class="wizard-tab-btn" data-section="sec-trazabilidad">Trazabilidad</button>
          <button class="wizard-tab-btn" data-section="sec-participantes">Participantes</button>
      </div>

      <!-- Contenedor con scroll vertical -->
      <div class="form-sections-container" id="formSections">
          
          <!-- SECCIÓN 1: Tipo de ítem -->
          <div id="sec-tipo" class="form-card-section">
              <h3 class="form-card-title">Tipo de ítem</h3>
              <p class="form-card-subtitle">Elige qué vas a registrar. Los campos se ajustan al tipo.</p>
              <div class="item-type-grid">
                  <div class="item-type-card selected" onclick="seleccionarTipoItem(this)">
                      <strong style="color: var(--green); font-size: 13px;">📦 Producto físico</strong>
                      <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--muted);">Mercancía con existencias, ubicación y movimiento en bodega.</p>
                  </div>
                  <div class="item-type-card" onclick="seleccionarTipoItem(this)">
                      <strong style="color: var(--text); font-size: 13px;">💻 Producto digital / Infinito</strong>
                      <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--muted);">Licencias, archivos o contenido descargable sin tope de stock.</p>
                  </div>
                  <div class="item-type-card" onclick="seleccionarTipoItem(this)">
                      <strong style="color: var(--text); font-size: 13px;">🛠️ Servicio o Licencia</strong>
                      <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--muted);">Acceso recurrente, suscripciones o servicios logísticos con vigencia.</p>
                  </div>
              </div>
          </div>

          <!-- SECCIÓN 2: Información general + Imagen -->
          <div id="sec-general" class="form-card-section">
              <h3 class="form-card-title">Información general</h3>
              <p class="form-card-subtitle">Datos de identificación y multimedia del ítem.</p>
              
              <div class="form-group">
                  <label class="form-label">Imagen del producto</label>
                  <div class="image-upload-box" onclick="document.getElementById('fileInputProd').click()">
                      <span style="font-size: 22px;">📷</span>
                      <p style="margin: 6px 0 2px 0; font-size: 12px; color: var(--text); font-weight: 600;">Haz clic para adjuntar imagen o arrástrala aquí</p>
                      <span style="font-size: 11px; color: var(--muted);">PNG, JPG o WEBP (Máx. 5MB)</span>
                      <input type="file" id="fileInputProd" style="display: none;" accept="image/*">
                  </div>
              </div>

              <div class="form-group">
                  <label class="form-label">Nombre del ítem *</label>
                  <input type="text" class="form-input" placeholder="Ej. Estiba plástica reforzada...">
              </div>
              <div class="form-group">
                  <label class="form-label">Código interno / SKU *</label>
                  <input type="text" class="form-input" value="INV-0101">
              </div>
              <div class="form-group">
                  <label class="form-label">Categoría *</label>
                  <select class="form-select">
                      <option>Selecciona una opción</option>
                      <option>Empaques y Embalajes</option>
                      <option>Tecnología y Licencias</option>
                      <option>Materia Prima</option>
                  </select>
              </div>
              <div class="form-group">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-textarea" rows="3" placeholder="Detalles operativos del producto..."></textarea>
              </div>
          </div>

          <!-- SECCIÓN 3: Disponibilidad -->
          <div id="sec-disponibilidad" class="form-card-section">
              <h3 class="form-card-title">Disponibilidad e inventario</h3>
              <p class="form-card-subtitle">Cómo se controla la existencia del ítem.</p>
              <div class="form-group">
                  <label class="form-label">Stock inicial</label>
                  <input type="number" class="form-input" placeholder="0">
              </div>
              <div class="form-group">
                  <label class="form-label">Stock mínimo de alerta</label>
                  <input type="number" class="form-input" placeholder="5">
              </div>
          </div>

          <!-- SECCIÓN 4: Precios -->
          <div id="sec-precios" class="form-card-section">
              <h3 class="form-card-title">Precios y costos</h3>
              <p class="form-card-subtitle">Valores comerciales y fiscales.</p>
              <div class="form-group">
                  <label class="form-label">Costo unitario</label>
                  <input type="number" class="form-input" placeholder="0.00">
              </div>
              <div class="form-group">
                  <label class="form-label">Precio de venta</label>
                  <input type="number" class="form-input" placeholder="0.00">
              </div>
          </div>

          <!-- SECCIÓN 5: Proveedor -->
          <div id="sec-proveedor" class="form-card-section">
              <h3 class="form-card-title">Proveedor y origen</h3>
              <p class="form-card-subtitle">De dónde proviene el ítem.</p>
              <div class="form-group">
                  <label class="form-label">Proveedor principal</label>
                  <input type="text" class="form-input" placeholder="Nombre de la empresa o proveedor...">
              </div>
          </div>

          <!-- SECCIÓN 6: Logística -->
          <div id="sec-logistica" class="form-card-section">
              <h3 class="form-card-title">Logística y almacenamiento</h3>
              <p class="form-card-subtitle">Medidas y condiciones de manejo físico.</p>
              <div class="form-group">
                  <label class="form-label">Peso (kg)</label>
                  <input type="number" class="form-input" placeholder="0.0">
              </div>
          </div>

          <!-- SECCIÓN 7: Trazabilidad -->
          <div id="sec-trazabilidad" class="form-card-section">
              <h3 class="form-card-title">Cumplimiento y trazabilidad</h3>
              <p class="form-card-subtitle">Información regulatoria y de calidad.</p>
              <div class="form-group">
                  <label class="form-label">País de origen</label>
                  <input type="text" class="form-input" placeholder="Colombia">
              </div>
          </div>

          <!-- SECCIÓN 8: PARTICIPANTES DINÁMICOS POR NÚMERO -->
          <div id="sec-participantes" class="form-card-section">
              <h3 class="form-card-title">Participantes y aforo en este stock</h3>
              <p class="form-card-subtitle">Escribe la cantidad de personas que trabajarán en este stock para desplegar sus campos.</p>
              
              <div class="form-group" style="margin-bottom: 20px;">
                  <label class="form-label" style="color: var(--green); font-size: 13px;">N° de participantes a asignar:</label>
                  <input type="number" id="numParticipantes" class="form-input" value="1" min="1" max="20" style="width: 120px; font-weight: 700;">
              </div>

              <!-- Contenedor donde se generan los campos de correo y rol según el número indicado -->
              <div id="contenedorFilasParticipantes"></div>
          </div>

      </div>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 14px; margin-top: auto; flex-shrink: 0;">
          <span style="font-size: 12px; color: var(--muted);">Ficha completa: <strong>80%</strong></span>
          <div style="display: flex; gap: 8px;">
              <button class="btn-secondary-action" id="btnCerrarDrawerFooter" style="padding: 6px 14px; font-size: 12px;">Cancelar</button>
              <button class="btn-primary-action" style="padding: 6px 16px; font-size: 12px;">Registrar ítem</button>
          </div>
      </div>
  `;

    drawer.style.display = "block";

    document.getElementById("cerrarDrawer").addEventListener("click", () => drawer.style.display = "none");
    document.getElementById("btnCerrarDrawerFooter").addEventListener("click", () => drawer.style.display = "none");

    // LÓGICA DINÁMICA DE PARTICIPANTES POR NÚMERO
    const inputNum = drawer.querySelector("#numParticipantes");
    const contenedorFilas = drawer.querySelector("#contenedorFilasParticipantes");

    const renderizarFilasParticipantes = (cantidad) => {
        contenedorFilas.innerHTML = "";
        for (let i = 1; i <= cantidad; i++) {
            const fila = document.createElement("div");
            fila.className = "participante-fila";
            fila.innerHTML = `
               <span style="font-size: 12px; color: var(--green); font-weight: 700; min-width: 24px;">#${i}</span>
               <input type="email" class="form-input" placeholder="correo.participante${i}@empresa.com" style="flex: 1;">
               <select class="form-select" style="width: 160px;">
                   <option value="RESPONSABLE">Responsable</option>
                   <option value="LOGISTICA">Logística</option>
                   <option value="OPERADOR">Operador</option>
                   <option value="AUDITOR">Auditor</option>
               </select>
           `;
            contenedorFilas.appendChild(fila);
        }
    };

    // Renderizado inicial con 1 persona
    renderizarFilasParticipantes(parseInt(inputNum.value) || 1);

    // Al cambiar el número se actualizan los campos
    inputNum.addEventListener("input", (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 20) val = 20;
        renderizarFilasParticipantes(val);
    });

    // Sincronización de pestañas superiores con el scroll
    const tabs = drawer.querySelectorAll(".wizard-tab-btn");
    const container = drawer.querySelector("#formSections");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const targetId = tab.getAttribute("data-section");
            const targetElement = drawer.querySelector(`#${targetId}`);
            if (targetElement) {
                container.scrollTo({
                    top: targetElement.offsetTop - container.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Función global auxiliar para seleccionar el tipo de ítem visualmente
window.seleccionarTipoItem = function(cardElement) {
    cardElement.parentElement.querySelectorAll(".item-type-card").forEach(c => {
        c.classList.remove("selected");
        c.querySelector("strong").style.color = "var(--text)";
    });
    cardElement.classList.add("selected");
    cardElement.querySelector("strong").style.color = "var(--green)";
};

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