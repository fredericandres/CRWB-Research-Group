/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.io.Serializable;

/**
 * Abstract class to manipulate DAOs
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <U> the DAO type
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractService<U extends AbstractDAO<S, T>, S extends AbstractEntity<T>, T extends Comparable<T>> implements Serializable {

    /**
     *
     * @return
     */
    public abstract U getDAO();
    
}
