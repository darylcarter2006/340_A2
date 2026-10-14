package com.darylcarter.gumball.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.darylcarter.gumball.entity.GumballCharacter;

@Repository
public interface GumballCharacterRepository extends JpaRepository<GumballCharacter, Long> {

    // GET /api/characters?species=Cat
    List<GumballCharacter> findBySpeciesIgnoreCase(String species);

    // GET /api/characters?name=wat (partial, case-insensitive)
    List<GumballCharacter> findByNameContainingIgnoreCase(String name);

    // GET /api/characters?species=Cat&name=wat
    List<GumballCharacter> findBySpeciesIgnoreCaseAndNameContainingIgnoreCase(String species, String name);
}
