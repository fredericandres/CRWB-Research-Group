/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.inject.Inject;
import javax.xml.bind.JAXBException;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <U> the dao type
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractConverter<U extends AbstractDAO<S, T>, S extends AbstractEntity<T>, T extends Comparable<T>> implements Converter {

    @Inject
    private AbstractDAO<S, T> dao;
    
    /**
     *
     * @return the dao
     */
    protected U getDAO(){
        return (U) dao;
    }

    /**
     *
     * @param facesContext
     * @param component
     * @param value
     * @return
     */
    @Override
    public Object getAsObject(FacesContext facesContext, UIComponent component, String value) {
        if (value == null || value.length() == 0) {
            return null;
        }
        try {
            return getDAO().findByPrimaryKey(getKey(value));
        } catch (JAXBException exception) {
            //throw exception;
        }
        return null;
    }

    /**
     *
     * @throws javax.xml.bind.JAXBException
     * @param value
     * @return
     */
    protected abstract T getKey(String value) throws JAXBException;

    /**
     *
     * @throws javax.xml.bind.JAXBException
     * @param value
     * @return
     */
    protected String getStringKey(T value) throws JAXBException {
        return value.toString();
    }

    /**
     *
     * @param facesContext
     * @param component
     * @param object
     * @return
     */
    @Override
    public String getAsString(FacesContext facesContext, UIComponent component, Object object) {
        if (object == null) {
            return null;
        }
        if (getDAO().getClasse().isInstance(object)) {
            S o = (S) object;
            try {
                return getStringKey(o.getPrimaryKey());
            } catch (JAXBException exception) {
                //throw exception;
            }
        }
        return null;
    }

}
