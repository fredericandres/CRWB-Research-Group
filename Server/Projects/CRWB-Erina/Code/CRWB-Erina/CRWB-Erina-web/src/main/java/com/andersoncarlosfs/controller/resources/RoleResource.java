/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.resources;

import com.andersoncarlosfs.controller.services.RoleService;
import com.andersoncarlosfs.model.AbstractResource;
import com.andersoncarlosfs.model.benchmark.wrappers.RoleWrapper;
import com.andersoncarlosfs.model.daos.RoleDAO;
import com.andersoncarlosfs.model.entities.Role;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.core.UriInfo;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
@Path("role")
public class RoleResource extends AbstractResource<RoleService, RoleDAO, RoleWrapper, Role, Short> {

    @Inject
    private RoleService service;

    /**
     *
     * @return the service
     */
    @Override
    protected RoleService getService() {
        return service;
    }

    @Override
    protected RoleWrapper wrap(Role entity, UriInfo context) {
        return new RoleWrapper(entity, context);
    }

}
