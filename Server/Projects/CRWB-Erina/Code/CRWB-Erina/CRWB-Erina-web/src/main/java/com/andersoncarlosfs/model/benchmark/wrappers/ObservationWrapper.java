/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.benchmark.wrappers;

import com.andersoncarlosfs.controller.resources.ObservationResource;
import com.andersoncarlosfs.model.AbstractWrapper;
import com.andersoncarlosfs.model.entities.Observation;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author anderson
 */
@XmlRootElement(name = "observation")
public class ObservationWrapper extends AbstractWrapper<Observation, Long> {

    public ObservationWrapper() {
    }

    public ObservationWrapper(Observation entity) {
        super(entity);
    }

    public ObservationWrapper(Observation entity, UriInfo context) {
        super(entity, context);
    }

    /**
     * 
     * @return 
     */
    @Override
    protected Class<ObservationResource> getResource() {
        return ObservationResource.class;
    }
    
    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idObservation
     */
    @XmlElement(name = "id")
    @Override
    public Long getPrimaryKey() {
        return super.getPrimaryKey(); //To change body of generated methods, choose Tools | Templates.
    }

    @XmlElement(name = "date")
    public Long getDate() {
        return getEntity().getDate().getTime();
    }

    /**
     *
     * @return the text
     */
    @XmlElement(name = "text")
    public String getText() {
        return getEntity().getText();
    }

    /**
     *
     * @param text the text to set
     */
    public void setText(String text) {
        getEntity().setText(text);
    }

    /**
     *
     * @return the picture
     */
    @XmlElement(name = "picture")
    public String getPicture() {
        PictureWrapper picture = new PictureWrapper(getEntity().getPicture(), getContext());
        if (picture.getData() == null) {
            return null;
        }
        if (getContext() == null) {
            return picture.getData();
        }
        return picture.getURI().toString();      
    }

}
