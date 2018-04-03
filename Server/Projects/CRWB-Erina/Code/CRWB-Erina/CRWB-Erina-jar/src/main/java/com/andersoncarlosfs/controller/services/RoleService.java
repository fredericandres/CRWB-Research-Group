/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.daos.RoleDAO;
import com.andersoncarlosfs.model.AbstractService;
import com.andersoncarlosfs.model.entities.Role;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@SessionScoped
public class RoleService extends AbstractService<RoleDAO, Role, Short> {

    @Inject
    private RoleDAO dao;

    /**
     *
     * @see com.andersoncarlosfs.model.AbstractService#getDAO()
     * @return the dao
     */
    @Override
    public RoleDAO getDAO() {
        return dao;
    }

}
