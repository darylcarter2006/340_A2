package com.darylcarter.gumball.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.darylcarter.gumball.entity.GumballCharacter;
import com.darylcarter.gumball.service.GumballCharacterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/characters")
public class GumballCharacterController {

    private final GumballCharacterService service;

    public GumballCharacterController(GumballCharacterService service) {
        this.service = service;
    }

    // GET /api/characters, optionally filtered with ?species= and/or ?name=
    @GetMapping
    public List<GumballCharacter> getCharacters(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String name) {
        return service.find(species, name);
    }

    @GetMapping("/{id}")
    public GumballCharacter getCharacter(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<GumballCharacter> addCharacter(@Valid @RequestBody GumballCharacter character) {
        GumballCharacter created = service.create(character);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public GumballCharacter updateCharacter(@PathVariable Long id,
            @Valid @RequestBody GumballCharacter character) {
        return service.update(id, character);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
