
package com.ofitech.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ofitech.model.Usuario;
import com.ofitech.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    public Usuario salvar(Usuario usuario) {

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {
        usuarioRepository.deleteById(id);
    }
}
