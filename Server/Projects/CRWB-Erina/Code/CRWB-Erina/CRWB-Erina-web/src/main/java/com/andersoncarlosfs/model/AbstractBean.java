/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import com.andersoncarlosfs.controller.beans.NotificationBean;
import com.andersoncarlosfs.controller.services.NotificationService;
import com.andersoncarlosfs.model.enums.Action;
import java.io.Serializable;
import java.util.List;
import javax.inject.Inject;
import javax.persistence.PersistenceException;

/**
 * Abstract class to manipulate Beans
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <V> the service type
 * @param <U> the dao type
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractBean<V extends AbstractService<U, S, T>, U extends AbstractDAO<S, T>, S extends AbstractEntity<T>, T extends Comparable<T>> implements Serializable {

    @Inject
    private AbstractService<U, S, T> service;
    private S selected;
    private List<S> items;

    /**
     *
     * @return the service
     */
    protected V getService() {
        return (V) service;
    }

    /**
     *
     * @return the selected
     */
    public S getSelected() {
        return selected;
    }

    /**
     *
     * @param selected the selected to set
     */
    public void setSelected(S selected) {
        this.selected = selected;
    }

    /**
     *
     * @param refresh
     * @return the items
     */
    public List<S> getItems(Boolean refresh) {
        if ((refresh) || (items == null)) {
            items = getService().getDAO().list();
        }
        return items;
    }

    /**
     *
     * @return the items
     */
    public List<S> getItems() {
        return getItems(Boolean.FALSE);
    }

    /**
     *
     * @throws java.lang.InstantiationException
     * @throws java.lang.IllegalAccessException
     * @return
     */
    public S prepareCreate() throws InstantiationException, IllegalAccessException {
        return getService().getDAO().getClasse().newInstance();
    }

    public void create() {
        manageEntity(Action.CREATE);
    }

    public void update() {
        manageEntity(Action.UPDATE);
    }

    public void destroy() {
        manageEntity(Action.DELETE);
    }

    private void manageEntity(Action action) {
        try {

            String message = null;

            switch (action) {
                case CREATE:
                    getService().getDAO().create(selected);
                    items.add(selected);
                    message = NotificationService.getString(getService().getDAO().getClasse().getSimpleName().concat("Created"));
                    break;
                case UPDATE:
                    getService().getDAO().update(selected);
                    message = NotificationService.getString(getService().getDAO().getClasse().getSimpleName().concat("Updated"));
                    break;
                case DELETE:
                    getService().getDAO().delete(selected.getPrimaryKey());
                    message = NotificationService.getString(getService().getDAO().getClasse().getSimpleName().concat("Deleted"));
                    items.remove(selected);
                    selected = null;
                    break;
                default:
                    message = null;
                    break;
            }

            NotificationBean.addSuccessMessage(message);

        } catch (PersistenceException exception) {
            NotificationBean.addErrorMessage(exception, NotificationService.getString("PersistenceErrorOccured"));
        }
    }

}
