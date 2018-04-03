/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import com.andersoncarlosfs.model.AbstractWrapper;
import com.andersoncarlosfs.model.AbstractEntity;
import static org.junit.Assert.*;
import org.junit.Test;

/**
 * Abstract class to manipulate entities
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <U> the wrapper type
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractWrapperTest<U extends AbstractWrapper<S, T>, S extends AbstractEntity<T>, T extends Comparable<T>> {

    public abstract U getObject();

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

}
