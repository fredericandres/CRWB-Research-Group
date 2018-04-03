/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

/**
 * Abstract class to manipulate Beans
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <X> the service type
 * @param <V> the service type
 * @param <U> the dao type
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractResource<V extends AbstractService<U, S, T>, U extends AbstractDAO<S, T>, X extends AbstractWrapper<S, T>, S extends AbstractEntity<T>, T extends Comparable<T>> implements Serializable {

    /**
     *
     * @return the service
     */
    protected abstract V getService();

    /**
     * Wrap
     *
     * @param entity
     * @param context
     * @return
     */
    protected abstract X wrap(S entity, UriInfo context);

    /**
     * Wrap
     *
     * @return
     */
    private List<X> wrap(List<S> entities, boolean eager, UriInfo context) {
        List<X> objects = new LinkedList<>();
        // 
        if (eager) {
            for (S s : entities) {
                objects.add(wrap(s, null));
            }
        } else {
            for (S s : entities) {
                objects.add(wrap(s, context));
            }
        }
        return objects;
    }

    /**
     * Create
     *
     * @param object
     */
    @POST
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void create(X object) {
        getService().getDAO().create(object.getEntity());
    }

    /**
     * Update
     *
     * @param primaryKey
     * @param object
     */
    @PUT
    @Path("{identificator}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void update(@PathParam("identificator") T primaryKey, X object) {
        getService().getDAO().update(object.getEntity());
    }

    /**
     * Delete
     *
     * @param primaryKey
     */
    @DELETE
    @Path("{identificator}")
    public void delete(@PathParam("identificator") T primaryKey) {
        getService().getDAO().delete(primaryKey);
    }

    /**
     * Find
     *
     * @param primaryKey
     * @param eager
     * @param context
     * @return
     */
    @GET
    @Path("{identificator}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public X findByPrimaryKey(@PathParam("identificator") T primaryKey, @QueryParam("eager") boolean eager, @Context UriInfo context) {
        if (eager) {
            return wrap(getService().getDAO().findByPrimaryKey(primaryKey), null);
        }
        return wrap(getService().getDAO().findByPrimaryKey(primaryKey), context);
    }

    /**
     * Count
     *
     * @return
     */
    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String count() {
        return getService().getDAO().count().toString();
    }

    /**
     * List
     *
     * @param eager
     * @param context
     * @return the list
     */
    @GET
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<X> list(@QueryParam("eager") boolean eager, @Context UriInfo context) {
        return wrap(getService().getDAO().list(), eager, context);
    }

    /**
     * List
     *
     * @param from
     * @param to
     * @param eager
     * @param context
     * @return the list
     */
    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<X> listByRange(@PathParam("from") Integer from, @PathParam("to") Integer to, @QueryParam("eager") boolean eager, @Context UriInfo context) {
        return wrap(getService().getDAO().listByRange(from, to), eager, context);
    }

}
