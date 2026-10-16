package com.omnilogix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "miembros_espacio", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"espacio_id", "correo"}, name = "uk_espacio_usuario")
})
public class MiembroEspacio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el Espacio de Trabajo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id", nullable = false, foreignKey = @ForeignKey(name = "fk_miembro_espacio"))
    private EspacioTrabajo espacioTrabajo;

    // Relación directa con el correo del usuario (aprovechando tu diseño de FK por correo)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "correo",
            referencedColumnName = "correo",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_miembro_usuario_correo")
    )
    private Usuario usuario;

    // Rol dinámico en este espacio específico (EJ: ADMIN_ESPACIO, LOGISTICA, LECTOR)
    @Column(nullable = false, length = 50)
    private String rol;

    public MiembroEspacio() {}

    public MiembroEspacio(EspacioTrabajo espacioTrabajo, Usuario usuario, String rol) {
        this.espacioTrabajo = espacioTrabajo;
        this.usuario = usuario;
        this.rol = rol;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EspacioTrabajo getEspacioTrabajo() { return espacioTrabajo; }
    public void setEspacioTrabajo(EspacioTrabajo espacioTrabajo) { this.espacioTrabajo = espacioTrabajo; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}