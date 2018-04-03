/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.services;

import com.andersoncarlosfs.model.enums.Configuration;
import java.util.Properties;
import javax.enterprise.context.ApplicationScoped;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@ApplicationScoped
public class SettingsManagerService {

    private static final Properties properties;

    static {
        properties = new Properties();
        for (Configuration setting : Configuration.values()) {
            getProperties().putIfAbsent(setting.name(), setting.value());
        }
    }

    /**
     *
     * @return the properties
     */
    public static final Properties getProperties() {
        return properties;
    }

    /**
     *
     * @param setting
     * @return the value
     */
    public static final String getProperty(Configuration setting) {
        return properties.getProperty(setting.name());
    }

    /**
     *
     * @param key
     * @return the value
     */
    public static final String getProperty(String key) {
        return properties.getProperty(key);
    }

}
