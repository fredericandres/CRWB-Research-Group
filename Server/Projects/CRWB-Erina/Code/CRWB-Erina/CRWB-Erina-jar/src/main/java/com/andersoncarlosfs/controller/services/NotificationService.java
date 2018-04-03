/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.enums.Configuration;
import java.text.MessageFormat;
import java.util.ResourceBundle;
import javax.enterprise.context.ApplicationScoped;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@ApplicationScoped
public class NotificationService {

    private static ResourceBundle resourceBundle;

    static {
        resourceBundle = ResourceBundle.getBundle(Configuration.ResourceBundle.value());
    }

    /**
     *
     * @param key
     * @return
     */
    public static String getString(String key) {
        return resourceBundle.getString(key);
    }

    /**
     *
     * @param key
     * @param arguments
     * @return
     */
    public static String getFormattedString(String key, Object... arguments) {
        return MessageFormat.format(getString(key), arguments);
    }

}
