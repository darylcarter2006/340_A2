package com.darylcarter.gumball.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * A character from The Amazing World of Gumball.
 */
@Entity
@Table(name = "characters")
public class GumballCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long characterId;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // e.g. Cat, Goldfish, Rabbit
    private String species;

    // e.g. Main Character, Best Friend, Mom
    private String role;

    @PositiveOrZero(message = "Age cannot be negative")
    private Integer age;

    public GumballCharacter() {
    }

    public GumballCharacter(String name, String description, String species, String role, Integer age) {
        this.name = name;
        this.description = description;
        this.species = species;
        this.role = role;
        this.age = age;
    }

    public Long getCharacterId() {
        return characterId;
    }

    public void setCharacterId(Long characterId) {
        this.characterId = characterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
