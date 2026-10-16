package com.omnilogix.controller;

import com.omnilogix.model.SesionUsuario;
import com.omnilogix.model.Usuario;
import com.omnilogix.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite la conexión desde el Frontend (Live Server / puertos locales)
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/signup")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario){
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            // Por seguridad limpiamos el password de la respuesta enviada por el cliente
            nuevoUsuario.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String identifier = credentials.get("identifier");
            String password = credentials.get("password");

            // Autentica al usuario y genera la sesión con Token único y hora UTC estricta en servidor
            SesionUsuario sesionActiva = usuarioService.iniciarSesionYCrearToken(identifier, password);

            return ResponseEntity.ok(sesionActiva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor.");
        }
    }

    @PostMapping("/validar-token")
    public ResponseEntity<?> validarToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean esValido = usuarioService.validarTokenActivo(token);
        if (esValido) {
            return ResponseEntity.ok().body(Map.of("valido", true));
        } else {
            return ResponseEntity.status(401).body(Map.of("valido", false, "mensaje", "Token vencido o inactivo."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        usuarioService.cerrarSesion(token);
        return ResponseEntity.ok().body(Map.of("mensaje", "Sesión cerrada correctamente."));
    }
}