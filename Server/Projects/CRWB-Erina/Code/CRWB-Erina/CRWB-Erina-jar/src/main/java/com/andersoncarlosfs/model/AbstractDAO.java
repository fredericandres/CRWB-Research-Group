/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.SingularAttribute;
import javax.transaction.Transactional;

/**
 * Abstract class to manipulate entities
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractDAO<S extends AbstractEntity<T>, T extends Comparable<T>> {

    @PersistenceContext(unitName = "CRWBPU")
    private EntityManager em;

    /**
     *
     * @return
     */
    protected EntityManager getEntityManager() {
        return em;
    }

    /**
     *
     * @return
     */
    public abstract Class<? extends S> getClasse();

    /**
     * Create
     *
     * @param entity
     */
    @Transactional
    public void create(S entity) {
        //em.getTransaction().begin();
        em.persist(entity);
        //em.flush();
        //em.getTransaction().commit();
    }

    /**
     * Update
     *
     * @param entity
     */
    @Transactional
    public void update(S entity) {
        //em.getTransaction().begin();
        em.merge(entity);
        //em.getTransaction().commit();
    }

    /**
     * Delete
     *
     * @param primaryKey
     */
    @Transactional
    public void delete(T primaryKey) {
        //em.getTransaction().begin();
        em.remove(findByPrimaryKey(primaryKey));
        //em.getTransaction().commit();
    }

    /**
     * Find
     *
     * @param primaryKey
     * @return
     */
    public S findByPrimaryKey(T primaryKey) {
        return em.find(getClasse(), primaryKey);
    }

    /**
     * Find
     *
     * @param attribute
     * @param value
     * @return
     */
    public S findByAttribute(SingularAttribute attribute, Object value) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery cq = cb.createQuery();
        Root<S> r = cq.from(getClasse());
        cq.where(cb.equal(r.get(attribute), value));
        return (S) em.createQuery(cq).getSingleResult();
    }

    /**
     * Count
     *
     * @return
     */
    public T count() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery cq = cb.createQuery();
        cq.select(cb.count(cq.from(getClasse())));
        return (T) em.createQuery(cq).getSingleResult();
    }

    /**
     * List
     *
     * @return the list
     */
    public List<S> list() {
        CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(getClasse()));
        return em.createQuery(cq).getResultList();
    }

    /**
     * List
     *
     * @param attribute
     * @param value
     * @return the list
     */
    public List<S> listByAttribute(SingularAttribute attribute, Object value) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery cq = cb.createQuery();
        Root<S> r = cq.from(getClasse());
        cq.where(cb.equal(r.get(attribute), value));
        return em.createQuery(cq).getResultList();
    }

    /**
     * List
     *
     * @param from
     * @param to
     * @return the list
     */
    public List<S> listByRange(int from, int to) {
        CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(getClasse()));
        Query q = em.createQuery(cq);
        q.setMaxResults(to - from + 1);
        q.setFirstResult(from);
        return q.getResultList();
    }

}
