package com.darylcarter.gumball.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.darylcarter.gumball.entity.GumballCharacter;
import com.darylcarter.gumball.exception.CharacterNotFoundException;
import com.darylcarter.gumball.repository.GumballCharacterRepository;

@Service
public class GumballCharacterService {

    private final GumballCharacterRepository repository;

    public GumballCharacterService(GumballCharacterRepository repository) {
        this.repository = repository;
    }

    public List<GumballCharacter> getAll() {
        return repository.findAll();
    }

    public GumballCharacter getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CharacterNotFoundException(id));
    }

    /**
     * Filters by species and/or a partial name. If both are given, a character
     * must match both. If neither is given, all characters are returned.
     */
    public List<GumballCharacter> find(String species, String name) {
        boolean hasSpecies = species != null && !species.isBlank();
        boolean hasName = name != null && !name.isBlank();

        if (hasSpecies && hasName) {
            return repository.findBySpeciesIgnoreCaseAndNameContainingIgnoreCase(species, name);
        }
        if (hasSpecies) {
            return repository.findBySpeciesIgnoreCase(species);
        }
        if (hasName) {
            return repository.findByNameContainingIgnoreCase(name);
        }
        return getAll();
    }

    public GumballCharacter create(GumballCharacter character) {
        // Ignore any id sent by the client so the database always generates it
        character.setCharacterId(null);
        return repository.save(character);
    }

    public GumballCharacter update(Long id, GumballCharacter updated) {
        GumballCharacter existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setSpecies(updated.getSpecies());
        existing.setRole(updated.getRole());
        existing.setAge(updated.getAge());
        return repository.save(existing);
    }

    public void delete(Long id) {
        GumballCharacter existing = getById(id);
        repository.delete(existing);
    }
}
