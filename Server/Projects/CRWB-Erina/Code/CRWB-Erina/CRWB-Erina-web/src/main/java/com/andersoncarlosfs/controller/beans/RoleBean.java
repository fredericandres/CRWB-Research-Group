package com.andersoncarlosfs.controller.beans;

import com.andersoncarlosfs.annotations.scopes.SessionScope;
import com.andersoncarlosfs.controller.services.RoleService;
import com.andersoncarlosfs.model.AbstractBean;
import com.andersoncarlosfs.model.AbstractConverter;
import com.andersoncarlosfs.model.daos.RoleDAO;
import com.andersoncarlosfs.model.entities.Role;
import javax.faces.convert.Converter;
import javax.faces.convert.FacesConverter;
import javax.xml.bind.JAXBException;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@SessionScope
public class RoleBean extends AbstractBean<RoleService, RoleDAO, Role, Short> {

    /**
     *
     */
    @FacesConverter(forClass = Role.class)
    public static class RoleConverter extends AbstractConverter<RoleDAO, Role, Short> implements Converter {

        /**
         *
         * @throws javax.xml.bind.JAXBException
         * @param value
         * @return
         */
        @Override
        protected Short getKey(String value) throws JAXBException {
            return new Short(value);
        }

    }

}
