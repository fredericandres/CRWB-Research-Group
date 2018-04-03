/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.benchmark.wrappers;

import com.andersoncarlosfs.controller.resources.RoleResource;
import com.andersoncarlosfs.model.AbstractWrapper;
import com.andersoncarlosfs.model.entities.Role;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author anderson
 */
@XmlRootElement(name = "observation")
public class RoleWrapper extends AbstractWrapper<Role, Short> {

    public RoleWrapper() {
    }

    public RoleWrapper(Role entity) {
        super(entity);
    }

    public RoleWrapper(Role entity, UriInfo context) {
        super(entity, context);
    }
    
    /**
     * 
     * @return 
     */
    @Override
    protected Class<RoleResource> getResource() {
        return RoleResource.class;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idObservation
     */
    @XmlElement(name = "id")
    @Override
    public Short getPrimaryKey() {
        return super.getPrimaryKey(); //To change body of generated methods, choose Tools | Templates.
    }

    @XmlElement(name = "name")
    public String getName() {
        return getEntity().getName();
    }

    /**
     *
     * @return the text
     */
    @XmlElement(name = "description")
    public String getDescription() {
        return getEntity().getDescription();
    }

}
