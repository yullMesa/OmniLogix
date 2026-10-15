package com.omnilogix.service;

import com.omnilogix.model.Usuario;
import com.omnilogix.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario registrarUsuario(Usuario usuario){
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        if (usuarioRepository.findByNombreUsuario(usuario.getNombreUsuario()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso.");
        }
        // Encriptar la contraseña usando BCrypt de forma segura
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        // Guardar en PostgreSQL (JPA maneja parámetros protegidos contra SQL Injection)
        return usuarioRepository.save(usuario);
    }
}
