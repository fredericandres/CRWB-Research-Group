/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.AbstractResourceTest;
import com.andersoncarlosfs.model.entities.Role;

/**
 *
 * @author anderson
 */
public class RoleResourceTest extends AbstractResourceTest<Role, Short> {

    private Role entity = new Role("Test");
    
    @Override
    public Class getResource() {
        return RoleService.class;
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
