package com.omnilogix.service;

import com.omnilogix.model.SesionUsuario;
import com.omnilogix.model.Usuario;
import com.omnilogix.repository.SesionRepository;
import com.omnilogix.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // <-- Importante
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SesionRepository sesionRepository;

    // Instanciamos el codificador de BCrypt
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Método de registro con encriptación BCrypt
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya se encuentra registrado.");
        }
        // Encriptamos la contraseña antes de guardarla en PostgreSQL
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    // Método de autenticación flexible (permite correo o nombre de usuario)
    public Usuario autenticarUsuario(String identifier, String password) {
        // Buscamos si existe por correo o por nombre de usuario usando el mismo valor ingresado
        // En tu UsuarioService.java (Línea 39):
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoOrNombreUsuario(identifier);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Comparamos la contraseña plana con el hash seguro de BCrypt
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                return usuario;
            }
        }
        throw new RuntimeException("Credenciales incorrectas.");
    }

    public SesionUsuario iniciarSesionYCrearToken(String identifier, String password) {
        Usuario usuario = autenticarUsuario(identifier, password);
        String tokenUnico = UUID.randomUUID().toString() + "-" + Instant.now().toEpochMilli();
        Instant horaUtc = Instant.now();

        SesionUsuario nuevaSesion = new SesionUsuario(usuario, tokenUnico, horaUtc);
        return sesionRepository.save(nuevaSesion);
    }

    public boolean validarTokenActivo(String tokenUnico) {
        if (tokenUnico == null || tokenUnico.isEmpty()) return false;
        return sesionRepository.findByTokenUnicoAndActivoTrue(tokenUnico).isPresent();
    }

    public void cerrarSesion(String tokenUnico) {
        if (tokenUnico != null) {
            sesionRepository.findByTokenUnicoAndActivoTrue(tokenUnico).ifPresent(sesion -> {
                sesion.setActivo(false);
                sesion.setFechaHoraSalidaUtc(Instant.now());
                sesionRepository.save(sesion);
            });
        }
    }
}