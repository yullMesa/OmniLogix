package com.omnilogix.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sesiones_usuario")
public class SesionUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación ManyToOne explícita para forzar a PostgreSQL a crear la FK física hacia el correo de usuarios
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "correo",
            referencedColumnName = "correo",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_sesiones_usuario_correo") // <--- Esto obliga a la BD a crear la FK física
    )
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 255)
    private String tokenUnico;

    @Column(nullable = false)
    private Instant fechaHoraIngresoUtc;

    private Instant fechaHoraSalidaUtc;

    @Column(nullable = false)
    private boolean activo = true;

    public SesionUsuario() {}

    // Constructor que recibe el objeto Usuario completo
    public SesionUsuario(Usuario usuario, String tokenUnico, Instant fechaHoraIngresoUtc) {
        this.usuario = usuario;
        this.tokenUnico = tokenUnico;
        this.fechaHoraIngresoUtc = fechaHoraIngresoUtc;
        this.activo = true;
    }

    // Getters y Setters
    public Long getId() { return id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    // Método rápido para obtener el correo directamente sin enredos
    public String getCorreo() {
        return usuario != null ? usuario.getCorreo() : null;
    }

    public String getTokenUnico() { return tokenUnico; }
    public void setTokenUnico(String tokenUnico) { this.tokenUnico = tokenUnico; }

    public Instant getFechaHoraIngresoUtc() { return fechaHoraIngresoUtc; }
    public void setFechaHoraIngresoUtc(Instant fechaHoraIngresoUtc) { this.fechaHoraIngresoUtc = fechaHoraIngresoUtc; }

    public Instant getFechaHoraSalidaUtc() { return fechaHoraSalidaUtc; }
    public void setFechaHoraSalidaUtc(Instant fechaHoraSalidaUtc) { this.fechaHoraSalidaUtc = fechaHoraSalidaUtc; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}