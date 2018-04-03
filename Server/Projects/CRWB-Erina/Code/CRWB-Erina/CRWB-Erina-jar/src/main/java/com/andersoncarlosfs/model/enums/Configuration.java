/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.enums;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
public enum Configuration {

    ResourceBundle("com/andersoncarlosfs/i18n/text/bundles/Bundle"),
    MessageDigest("SHA-256");

    private final String value;

    private Configuration(String value) {
        this.value = value;
    }

    /**
     *
     * @return the value
     */
    public String value() {
        return value;
    }

    /**
     *
     * @see Object#toString()
     * @return
     */
    @Override
    public String toString() {
        return getClass().getName() + "[" + name() + "=" + value + "]";
    }

}
