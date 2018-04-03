/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import com.andersoncarlosfs.model.AbstractEntity;
import java.io.Serializable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@Entity
@Table(name = "aliases", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Alias.findAll", query = "SELECT a FROM Alias a"),
    @NamedQuery(name = "Alias.findByIdPerson", query = "SELECT a FROM Alias a WHERE a.aliasPK.idPerson = :idPerson"),
    @NamedQuery(name = "Alias.findByAlias", query = "SELECT a FROM Alias a WHERE a.aliasPK.alias = :alias")})
public class Alias extends AbstractEntity<AliasPK> implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected AliasPK aliasPK;
    @JoinColumn(name = "id_person", referencedColumnName = "id_person", nullable = false, insertable = false, updatable = false)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Person person;

    public Alias() {
    }

    public Alias(AliasPK aliasPK) {
        this.aliasPK = aliasPK;
    }

    public Alias(long idPerson, String alias) {
        this.aliasPK = new AliasPK(idPerson, alias);
    }

    public Alias(Long idPerson, String alias) {
        this.aliasPK = new AliasPK(idPerson, alias);
    }

    /**
     *
     * @return the aliasPK
     */
    public AliasPK getAliasPK() {
        return aliasPK;
    }

    /**
     *
     * @param aliasPK the aliasPK to set
     */
    public void setAliasPK(AliasPK aliasPK) {
        this.aliasPK = aliasPK;
    }

    /**
     *
     * @return the person
     */
    public Person getPerson() {
        return person;
    }

    /**
     *
     * @param person the person to set
     */
    public void setPerson(Person person) {
        this.person = person;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the aliasPK
     */
    @Override
    public AliasPK getPrimaryKey() {
        return aliasPK;
    }

}
