/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.util.UUID;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlTransient;

/**
 * Abstract class to wrap entities
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractWrapper<S extends AbstractEntity<T>, T extends Comparable<T>> implements Comparable<T> {

    private S entity;
    private UriInfo context;

    public AbstractWrapper() {
    }

    public AbstractWrapper(S entity) {
        this.entity = entity;
    }

    public AbstractWrapper(S entity, UriInfo context) {
        this.entity = entity;
        this.context = context;
    }

    /**
     *
     * @return
     */
    @XmlTransient
    protected abstract Class<? extends AbstractResource<?, ?, ? extends AbstractWrapper<S, T>, S, T>> getResource();

    /**
     * 
     * @return 
     */
    @XmlTransient
    public URI getURI() {
        return context.getBaseUriBuilder().path(getResource()).path(entity.getPrimaryKey().toString()).build();    
    }

    /**
     *
     * @return the uuid
     */
    @XmlTransient
    public UUID getUUID() {
        return entity.getUUID();
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idObservation
     */
    public T getPrimaryKey() {
        return entity.getPrimaryKey();
    }

    /**
     *
     * @return the entity
     */
    @XmlTransient
    public S getEntity() {
        return entity;
    }

    /**
     *
     * @return the context
     */
    @XmlTransient
    public UriInfo getContext() {
        return context;
    }

    /**
     *
     * @param context the context to set
     */
    public void setContext(UriInfo context) {
        this.context = context;
    }

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
