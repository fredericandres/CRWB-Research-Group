/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.daos.EmailDAO;
import com.andersoncarlosfs.model.AbstractService;
import com.andersoncarlosfs.model.entities.Email;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@SessionScoped
public class EmailService extends AbstractService<EmailDAO, Email, Long> {

    @Inject
    private EmailDAO dao;

    /**
     *
     * @see com.andersoncarlosfs.model.AbstractService#getDAO()
     * @return the dao
     */
    @Override
    public EmailDAO getDAO() {
        return dao;
    }

}
