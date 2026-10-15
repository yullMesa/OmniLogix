package com.omnilogix.repository;

import com.omnilogix.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    // Consulta explícita para aceptar correo O nombre de usuario de forma segura
    @Query("SELECT u FROM Usuario u WHERE u.correo = :identifier OR u.nombreUsuario = :identifier")
    Optional<Usuario> findByCorreoOrNombreUsuario(@Param("identifier") String identifier);
}