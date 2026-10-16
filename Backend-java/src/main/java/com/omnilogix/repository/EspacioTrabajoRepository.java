package com.omnilogix.repository;

import com.omnilogix.model.EspacioTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspacioTrabajoRepository extends JpaRepository<EspacioTrabajo, Long> {
}