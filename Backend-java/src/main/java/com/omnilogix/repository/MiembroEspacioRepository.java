package com.omnilogix.repository;

import com.omnilogix.model.MiembroEspacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MiembroEspacioRepository extends JpaRepository<MiembroEspacio, Long> {

    // Buscar todos los espacios a los que pertenece un usuario por su correo
    List<MiembroEspacio> findByUsuarioCorreo(String correo);

    // Consultar el rol específico de un usuario dentro de un espacio determinado
    Optional<MiembroEspacio> findByEspacioTrabajoIdAndUsuarioCorreo(Long espacioId, String correo);
}