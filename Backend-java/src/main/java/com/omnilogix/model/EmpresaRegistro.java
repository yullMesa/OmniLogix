package com.omnilogix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "empresas_registro")
public class EmpresaRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 1. Información personal ---
    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(nullable = false)
    private String cargo;

    @Column(name = "correo_corporativo", nullable = false, unique = true)
    private String correoCorporativo;

    @Column(nullable = false)
    private String telefono;

    // --- 2. Información de la empresa ---
    @Column(name = "nombre_empresa", nullable = false)
    private String nombreEmpresa;

    @Column(name = "nit_tributaria", nullable = false, unique = true)
    private String nitTributaria;

    @Column(name = "sector_industria", nullable = false)
    private String sectorIndustria;

    @Column(name = "tamano_empresa", nullable = false)
    private String tamanoEmpresa;

    @Column(nullable = false)
    private String pais;

    @Column(nullable = false)
    private String ciudad;

    // --- 3. Información operativa ---
    @Column(name = "numero_vehiculos", nullable = false)
    private Integer numeroVehiculos;

    @Column(name = "numero_bodegas", nullable = false)
    private Integer numeroBodegas;

    // --- 4. Soluciones de interés (Se pueden guardar como booleanos o un texto resumido) ---
    @Column(name = "sol_gestion_flotas")
    private boolean solGestionFlotas;

    @Column(name = "sol_inventarios")
    private boolean solInventarios;

    @Column(name = "sol_contratos")
    private boolean solContratos;

    @Column(name = "sol_cumplimiento")
    private boolean solCumplimiento;

    @Column(name = "sol_reportes")
    private boolean solReportes;

    // --- 5. Seguridad de la cuenta ---
    @Column(nullable = false)
    private String password; // Aquí guardaremos el hash de la contraseña

    @Column(name = "acepta_terminos", nullable = false)
    private boolean aceptaTerminos;

    // Constructor vacío obligatorio para JPA
    public EmpresaRegistro() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getCorreoCorporativo() { return correoCorporativo; }
    public void setCorreoCorporativo(String correoCorporativo) { this.correoCorporativo = correoCorporativo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getNombreEmpresa() { return nombreEmpresa; }
    public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }

    public String getNitTributaria() { return nitTributaria; }
    public void setNitTributaria(String nitTributaria) { this.nitTributaria = nitTributaria; }

    public String getSectorIndustria() { return sectorIndustria; }
    public void setSectorIndustria(String sectorIndustria) { this.sectorIndustria = sectorIndustria; }

    public String getTamanoEmpresa() { return tamanoEmpresa; }
    public void setTamanoEmpresa(String tamanoEmpresa) { this.tamanoEmpresa = tamanoEmpresa; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public Integer getNumeroVehiculos() { return numeroVehiculos; }
    public void setNumeroVehiculos(Integer numeroVehiculos) { this.numeroVehiculos = numeroVehiculos; }

    public Integer getNumeroBodegas() { return numeroBodegas; }
    public void setNumeroBodegas(Integer numeroBodegas) { this.numeroBodegas = numeroBodegas; }

    public boolean isSolGestionFlotas() { return solGestionFlotas; }
    public void setSolGestionFlotas(boolean solGestionFlotas) { this.solGestionFlotas = solGestionFlotas; }

    public boolean isSolInventarios() { return solInventarios; }
    public void setSolInventarios(boolean solInventarios) { this.solInventarios = solInventarios; }

    public boolean isSolContratos() { return solContratos; }
    public void setSolContratos(boolean solContratos) { this.solContratos = solContratos; }

    public boolean isSolCumplimiento() { return solCumplimiento; }
    public void setSolCumplimiento(boolean solCumplimiento) { this.solCumplimiento = solCumplimiento; }

    public boolean isSolReportes() { return solReportes; }
    public void setSolReportes(boolean solReportes) { this.solReportes = solReportes; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isAceptaTerminos() { return aceptaTerminos; }
    public void setAceptaTerminos(boolean aceptaTerminos) { this.aceptaTerminos = aceptaTerminos; }
}