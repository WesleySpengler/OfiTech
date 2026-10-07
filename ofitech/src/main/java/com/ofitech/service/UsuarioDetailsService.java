
package com.ofitech.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioService usuarioService;

    public UsuarioDetailsService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        var usuario = usuarioService.buscarPorEmail(email);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado");
        }

        return User
                .withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .roles("USER")
                .build();
    }
}

