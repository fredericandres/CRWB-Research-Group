/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.AbstractEntity;
import com.andersoncarlosfs.model.enums.Configuration;
import java.lang.reflect.Field;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.metamodel.SingularAttribute;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@ApplicationScoped
public class SecurityService {

    /**
     *
     * @throws java.security.NoSuchAlgorithmException
     * @throws java.lang.NoSuchFieldException
     * @throws java.lang.IllegalAccessException
     * @param entity
     * @param attribute
     */
    public void encryptField(AbstractEntity entity, SingularAttribute attribute) throws NoSuchAlgorithmException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
        MessageDigest md = MessageDigest.getInstance(Configuration.MessageDigest.value());
        Field field = entity.getClass().getField(attribute.getName());
        field.setAccessible(Boolean.TRUE);
        md.update(field.get(entity).toString().getBytes());
        field.set(entity, new sun.misc.BASE64Encoder().encode(md.digest()));
    }

}
