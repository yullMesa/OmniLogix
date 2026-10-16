package com.omnilogix.repository;

import com.omnilogix.model.SesionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<SesionUsuario, Long> {
    Optional<SesionUsuario> findByTokenUnicoAndActivoTrue(String tokenUnico);
}