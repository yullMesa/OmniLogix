package com.omnilogix.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "espacios_trabajo")
public class EspacioTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Instant fechaCreacionUtc = Instant.now();

    public EspacioTrabajo() {}

    public EspacioTrabajo(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaCreacionUtc = Instant.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Instant getFechaCreacionUtc() { return fechaCreacionUtc; }
    public void setFechaCreacionUtc(Instant fechaCreacionUtc) { this.fechaCreacionUtc = fechaCreacionUtc; }
}