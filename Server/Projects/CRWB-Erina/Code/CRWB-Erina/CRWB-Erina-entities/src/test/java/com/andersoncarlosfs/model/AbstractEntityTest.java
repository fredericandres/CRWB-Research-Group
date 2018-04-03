/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import static org.junit.Assert.*;
import org.junit.Test;

/**
 * Abstract class to manipulate entities
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractEntityTest<S extends AbstractEntity<T>, T extends Comparable<T>> {

    public abstract S getObject();

    /**
     *
     * @throws java.lang.CloneNotSupportedException
     * @see Object#clone()
     * @return
     */
    public S getCloneModified() throws CloneNotSupportedException {
        return (S) getObject().clone();
    }

    /**
     * Test of toXML method, of class AbstractEntity.
     *
     * @throws java.lang.Exception
     */
    @Test
    public void testToXML() throws Exception {
        System.out.println("Started testToXML");
        System.out.println("XML=" + getObject().toXML());
        assertNotNull(getObject().toXML());
        System.out.println("Finalized testToXML");
    }

    /**
     * Test of clone method, of class AbstractEntity.
     *
     * @throws java.lang.Exception
     */
    @Test
    public void testClone() throws Exception {
        System.out.println("Started testClone");
        System.out.println("Object=" + getObject().toXML());
        S clone = (S) getObject().clone();
        System.out.println("Clone=" + clone.toXML());
        assertEquals(getObject(), clone);
        System.out.println("Finalized testClone");
    }

    /**
     * Test of clone method, of class AbstractEntity.
     *
     * @throws java.lang.Exception
     */
    @Test
    public void testCloneModified() throws Exception {
        System.out.println("Started testCloneChanged");
        System.out.println("Object=" + getObject());
        S clone = (S) getCloneModified().clone();
        System.out.println("Clone=" + clone.toXML());
        assertEquals(getObject(), clone);
        System.out.println("Finalized testCloneChanged");
    }

}
