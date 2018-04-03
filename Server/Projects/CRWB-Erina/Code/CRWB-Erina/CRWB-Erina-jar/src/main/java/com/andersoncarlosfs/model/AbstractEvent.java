/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

/**
 * Abstract class to manipulate events
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractEvent<S extends AbstractEntity<T>, T extends Comparable<T>> {

    private S object;

    public AbstractEvent() {
    }

    public AbstractEvent(S object) {
        this.object = object;
    }

    /**
     * @return the object
     */
    public S getObject() {
        return (S) object;
    }

    /**
     * @param object the object to set
     */
    public void setObject(S object) {
        this.object = object;
    }

}
