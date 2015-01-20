package com.mirhagk;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Created by mirhagk on 2015-01-19.
 */
public class DoubleStack<T> {
    Deque<T> deque = new ArrayDeque<T>();
    int length1 = 0;
    int length2 = 0;
    void push1(T value){
        length1++;
        deque.addFirst(value);
    }
    void push2(T value){
        length2++;
        deque.addLast(value);
    }
    T pop1(){
        if (length1==0)
            throw new IndexOutOfBoundsException();
        length1--;
        return deque.removeFirst();
    }
    T pop2(){
        if (length2==0)
            throw new IndexOutOfBoundsException();
        length2--;
        return deque.removeLast();
    }
}
