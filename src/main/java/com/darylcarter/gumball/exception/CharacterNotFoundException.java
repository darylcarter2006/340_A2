package com.darylcarter.gumball.exception;

public class CharacterNotFoundException extends RuntimeException {

    public CharacterNotFoundException(Long id) {
        super("Character not found with id " + id);
    }
}
