/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.benchmark.wrappers;

import com.andersoncarlosfs.controller.resources.PictureResource;
import com.andersoncarlosfs.model.AbstractWrapper;
import com.andersoncarlosfs.model.entities.Picture;
import java.util.Base64;
import javax.ws.rs.core.UriInfo;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author anderson
 */
@XmlRootElement(name = "picture")
public class PictureWrapper extends AbstractWrapper<Picture, Long> {

    public PictureWrapper() {
    }

    public PictureWrapper(Picture entity) {
        super(entity);
    }

    public PictureWrapper(Picture entity, UriInfo context) {
        super(entity, context);
    }
    
    /**
     * 
     * @return 
     */
    @Override
    protected Class<PictureResource> getResource() {
        return PictureResource.class;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idPicture
     */
    @XmlElement(name = "id")
    @Override
    public Long getPrimaryKey() {
        return super.getPrimaryKey(); //To change body of generated methods, choose Tools | Templates.
    }

    /**
     *
     * @return the picture
     */
    @XmlElement(name = "data")
    public String getData() {
        if (getEntity().getData() == null || getEntity().getData() == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(getEntity().getData());
    }

}
