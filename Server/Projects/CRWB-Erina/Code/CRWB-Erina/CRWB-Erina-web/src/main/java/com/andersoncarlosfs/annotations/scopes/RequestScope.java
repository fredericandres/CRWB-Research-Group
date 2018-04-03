/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.annotations.scopes;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.enterprise.inject.Stereotype;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@javax.inject.Named
@javax.enterprise.context.RequestScoped
@Retention(RetentionPolicy.RUNTIME)
@Stereotype
@Target(ElementType.TYPE)
public @interface RequestScope {

}
