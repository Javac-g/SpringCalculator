package com.anobel.calculator.model;

public class Value {
    private final Double x;

    public Value(Number x){
        this.x = (Double) x;
    }
    public Double getX(){
        return x;
    }
    @Override
    public String toString(){
        return String.format("%f ",x);
    }
}
