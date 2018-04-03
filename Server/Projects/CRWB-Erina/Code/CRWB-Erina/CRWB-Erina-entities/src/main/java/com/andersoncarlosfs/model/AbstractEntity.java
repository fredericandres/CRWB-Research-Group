/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.io.ByteArrayOutputStream;
import java.util.UUID;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

/**
 * Abstract class to identify entities
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <T> the identifier type
 */
public abstract class AbstractEntity<T extends Comparable<T>> implements Comparable<T>, Cloneable {

    private final UUID uuid = UUID.randomUUID();

    /**
     *
     * @return the uuid
     */
    public UUID getUUID() {
        return uuid;
    }

    /**
     *
     * @return
     */
    public abstract T getPrimaryKey();

    /**
     *
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     * @param o
     * @return
     */
    @Override
    public int compareTo(T o) {
        return getPrimaryKey().compareTo(o);
    }

    /**
     *
     * @throws java.lang.CloneNotSupportedException
     * @see Object#clone()
     * @return
     */
    @Override
    public AbstractEntity clone() throws CloneNotSupportedException {
        return (AbstractEntity) super.clone();
    }

    /**
     *
     * @see java.lang.Object#hashCode()
     * @return
     */
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (getPrimaryKey() != null ? getPrimaryKey().hashCode() : 0);
        return hash;
    }

    /**
     *
     * @see java.lang.Object#equals(java.lang.Object)
     * @param object
     * @return
     */
    @Override
    public boolean equals(Object object) {
        if (!(getClass().isInstance(object))) {
            return false;
        }
        AbstractEntity other = (AbstractEntity) object;
        if ((getPrimaryKey() == null && other.getPrimaryKey() != null) || (getPrimaryKey() != null && !getPrimaryKey().equals(other.getPrimaryKey()))) {
            return false;
        }
        return true;
    }

    /**
     *
     * @see java.lang.Object#toString()
     * @return
     */
    @Override
    public String toString() {
        return getClass().getName() + "[primary key=" + getPrimaryKey() + "]";
    }
    
    /**
     *
     * @throws javax.xml.bind.JAXBException
     * @return
     */
    public String toXML() throws JAXBException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        JAXBContext jc = JAXBContext.newInstance(getClass());
        Marshaller marshaller = jc.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        marshaller.marshal(this, baos);
        return baos.toString();
    }

}
