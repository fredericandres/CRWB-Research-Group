/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.persistence;

import com.andersoncarlosfs.model.AbstractPersistenceTest;
import com.andersoncarlosfs.model.entities.Role;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
public class RolePersistenceTest extends AbstractPersistenceTest<Role, Short> {

    private Role entity = new Role("Test");

    @Override
    public Class getClasse() {
        return Role.class;
    }

    @Override
    public Role getObject() {
        return entity;
    }

    @Override
    public void modifyObject() {
        entity.setName("Modified");
    }

}
