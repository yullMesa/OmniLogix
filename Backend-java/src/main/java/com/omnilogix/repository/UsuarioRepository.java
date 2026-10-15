package com.omnilogix.repository;

import com.omnilogix.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
}