package com.omnilogix.model;

import jakarta.persistence.*;
import org.hibernate.sql.Update;

import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false )
    private UUID id;

    @Column(nullable = false, length = 50)
    private String tipoPersona; //Natural o Juridica

    @Column(nullable = false,length = 100)
    private String nombreCompleto;

    @Column(nullable = false, unique = true,length = 50)
    private  String nombreUsuario;

    @Column(nullable = false, unique = true ,length = 100)
    private String correo;

    @Column(nullable = false, unique = true ,length = 20)
    private String telefono;

    @Column(nullable = false)
    private String password;// se guarda encriptado por BCrypt

    @Column(length = 150)
    private String nombreEmpresa; // opcional (solo juridico)

    @Column(length = 50)
    private String nitEmpresa; // opcional (solo juridico)

//    constructor vacio requerido por jpa
    public Usuario(){}


//    Getters y Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTipoPersona() { return tipoPersona; }
    public void setTipoPersona(String tipoPersona) { this.tipoPersona = tipoPersona; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombreEmpresa() { return nombreEmpresa; }
    public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }

    public String getNitEmpresa() { return nitEmpresa; }
    public void setNitEmpresa(String nitEmpresa) { this.nitEmpresa = nitEmpresa; }


}