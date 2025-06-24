package com.anobel.calculator.model;

public class Solution {
    private Value x,y;
    Operation operation;
    Double ans;

    public Solution(Value x, Operation operation,Value y){
        this.x = x;
        this.y = y;
        this.operation = operation;
    }
    public Double getSolution(){
        double ans = 0;
        switch (operation){
            case ADD -> ans = add();
            case SUBSTRUCT -> ans = subtract();
            case MULTIPLY -> ans = multiply();
            case DIVIDE -> ans = divide();
        }
        return ans;
    }
    public Double getAns(){
        ans = getSolution();
        return ans;
    }
    public Double add(){
        return x.getVal() + y.getVal();
    }
    public Double subtract(){
        return x.getVal() - y.getVal();
    }
    public Double multiply(){
        return x.getVal() * y.getVal();
    }
    public Double divide(){
        return x.getVal() / y.getVal();
    }

    @Override
    public String toString(){
        return String.format("%f %s %f = %f", x.getVal(),operation, y.getVal(), getAns() );
    }
}
