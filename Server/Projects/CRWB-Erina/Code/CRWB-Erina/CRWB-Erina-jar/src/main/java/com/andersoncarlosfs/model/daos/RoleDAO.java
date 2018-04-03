/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.daos;

import com.andersoncarlosfs.model.AbstractDAO;
import com.andersoncarlosfs.model.entities.Role;
import javax.enterprise.context.RequestScoped;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
public class RoleDAO extends AbstractDAO<Role, Short> {

    /**
     *
     * @see AbstractDAO#getClasse()
     * @return
     */
    @Override
    public Class<Role> getClasse() {
        return Role.class;
    }

}
