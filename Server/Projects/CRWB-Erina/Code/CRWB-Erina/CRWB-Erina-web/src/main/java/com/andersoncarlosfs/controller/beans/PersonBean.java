package com.andersoncarlosfs.controller.beans;

import com.andersoncarlosfs.annotations.scopes.SessionScope;
import com.andersoncarlosfs.controller.services.PersonService;
import com.andersoncarlosfs.model.AbstractBean;
import com.andersoncarlosfs.model.AbstractConverter;
import com.andersoncarlosfs.model.daos.PersonDAO;
import com.andersoncarlosfs.model.entities.Person;
import javax.faces.convert.Converter;
import javax.faces.convert.FacesConverter;
import javax.xml.bind.JAXBException;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@SessionScope
public class PersonBean extends AbstractBean<PersonService, PersonDAO, Person, java.lang.Long> {

    /**
     *
     */
    @FacesConverter(forClass = Person.class)
    public static class PersonConverter extends AbstractConverter<PersonDAO, Person, java.lang.Long> implements Converter {

        /**
         *
         * @throws javax.xml.bind.JAXBException
         * @param value
         * @return
         */
        @Override
        protected java.lang.Long getKey(String value) throws JAXBException {
            return new java.lang.Long(value);
        }

    }

}
