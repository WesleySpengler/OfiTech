package com.ofitech.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClienteController {

    @GetMapping("/clientes")
    public String listarClientes() {
        return "Aqui aparecerão os clientes do OfiTech!";
    }

}