package com.anobel.calculator.model;

public class Value {
    private Double x;

    public Value(Number x){
        this.x = (Double) x;
    }
    public Double getX(){
        return x;
    }
}
