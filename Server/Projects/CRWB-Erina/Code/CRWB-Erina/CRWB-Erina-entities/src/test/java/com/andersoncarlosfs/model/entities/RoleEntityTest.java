/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import com.andersoncarlosfs.model.AbstractEntityTest;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
public class RoleEntityTest extends AbstractEntityTest<Role, Short> {

    private Role role = new Role("Test");

    @Override
    public Role getObject() {
        return role;
    }

    @Override
    public Role getCloneModified() throws CloneNotSupportedException {
        Role modified = super.getCloneModified();
        modified.setName("Modified");
        return modified;
    }

}
