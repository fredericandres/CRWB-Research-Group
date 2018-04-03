/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller;

import com.andersoncarlosfs.controller.filters.CORSResponseFilter;
import com.andersoncarlosfs.controller.resources.ObservationResource;
import com.andersoncarlosfs.controller.resources.PictureResource;
import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import org.glassfish.jersey.media.multipart.MultiPartFeature;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@ApplicationPath("resource")
public class ApplicationConfiguration extends Application {

    /**
     *
     * @return
     */
    @Override
    public Set<Class<?>> getClasses() {
        final Set<Class<?>> resources = new HashSet<Class<?>>();
        //
        resources.add(ObservationResource.class);
        resources.add(PictureResource.class);
        //
        resources.add(MultiPartFeature.class);
        //
        resources.add(CORSResponseFilter.class);
        return resources;
    }
    
}
