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

            // Ocultar todas las secciones principales
            document.querySelectorAll(".torre-content").forEach(content => {
                content.style.display = "none";
            });

            const activeContent = document.getElementById(targetId);
            if (activeContent) {
                activeContent.style.display = "block";
            }
        });
    }

    // 2. Control de sub-pestañas internas de Inventario (Catálogo, Tablero, etc.)
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

    // Cargar datos iniciales
    cargarDatosTorreControl();
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
                    <div style="background: rgba(10, 32, 31, 0.7); border: 1px solid var(--border); border-radius: 12px; padding: 18px;">
                        <p style="font-size: 12px; color: var(--muted); margin: 0 0 8px 0;">${kpi.titulo}</p>
                        <h3 style="font-size: 28px; font-weight: 800; margin: 0 0 6px 0;">${kpi.valor}</h3>
                        <span style="font-size: 11px; color: ${kpi.positivo ? 'var(--green)' : '#ff6b6b'};">${kpi.tendencia}</span>
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
}