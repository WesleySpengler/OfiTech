package com.ofitech.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.ofitech.service.UsuarioDetailsService;

@Configuration
public class SecurityConfig {

    private final UsuarioDetailsService usuarioDetailsService;

    public SecurityConfig(UsuarioDetailsService usuarioDetailsService) {
        this.usuarioDetailsService = usuarioDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .userDetailsService(usuarioDetailsService)

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/login.html",
                    "/cadastro.html",
                    "/cadastro",
                    "/style.css"
                ).permitAll()
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
    .loginPage("/login.html")
    .loginProcessingUrl("/login")
    .defaultSuccessUrl("/", true)
    .failureUrl("/login.html?error")
    .permitAll()
);

        return http.build();
    }
}