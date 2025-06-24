package com.anobel.calculator.model;

public class Value {
    private final Double val;

    public Value(Number x){
        this.val = (Double) x;
    }
    public Double getVal(){
        return val;
    }
    @Override
    public String toString(){
        return String.format("%f ",val);
    }
}
