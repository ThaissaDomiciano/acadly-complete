package com.acadly.gestao_tarefas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/usuarios/**",
                    "/auth/**",
                    "/turmas/**",
                    "/aluno-turma/**",
                    "/tarefas/**",
                    "/entregas/**",
                    "/avaliar/**",
                    "/notificacoes/**"
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
