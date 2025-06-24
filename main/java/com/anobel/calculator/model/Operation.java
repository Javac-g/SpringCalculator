package com.anobel.calculator.model;

public enum Operation {
   ADD,
    SUBSTRUCT,
    MULTIPLY,
    DIVIDE;

    @Override
    public String toString() {
        return name().charAt(0) + name().substring(1).toLowerCase();
    }
}
