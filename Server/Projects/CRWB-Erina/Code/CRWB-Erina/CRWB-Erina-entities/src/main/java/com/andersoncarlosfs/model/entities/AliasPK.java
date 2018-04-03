/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@Embeddable
public class AliasPK implements Comparable<AliasPK>, Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "id_person", nullable = false)
    private Long idPerson;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1)
    @Column(nullable = false)
    private String alias;

    public AliasPK() {
    }

    public AliasPK(long idPerson, String alias) {
        this.idPerson = idPerson;
        this.alias = alias;
    }

    public AliasPK(Long idPerson, String alias) {
        this.idPerson = idPerson;
        this.alias = alias;
    }

    public AliasPK(Person person, String alias) {
        this.idPerson = person.getPrimaryKey();
        this.alias = alias;
    }

    /**
     *
     * @return the idPerson
     */
    public Long getIdPerson() {
        return idPerson;
    }

    /**
     *
     * @param idPerson the idPerson to set
     */
    public void setIdPerson(Long idPerson) {
        this.idPerson = idPerson;
    }

    /**
     *
     * @return the alias
     */
    public String getAlias() {
        return alias;
    }

    /**
     *
     * @param alias the alias to set
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }

    /**
     *
     * @see Comparable#compareTo(java.lang.Object)
     * @param o
     * @return
     */
    @Override
    public int compareTo(AliasPK o) {
        if (this.idPerson.equals(o.idPerson)) {
            return this.alias.compareTo(o.alias);
        } else {
            return this.idPerson.compareTo(o.idPerson);
        }
    }

    /**
     *
     * @see java.lang.Object#hashCode()
     * @return
     */
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) idPerson.intValue();
        hash += (alias != null ? alias.hashCode() : 0);
        return hash;
    }

    /**
     *
     * @see java.lang.Object#equals(java.lang.Object)
     * @param object
     * @return
     */
    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof AliasPK)) {
            return false;
        }
        AliasPK other = (AliasPK) object;
        if (this.idPerson != other.idPerson) {
            return false;
        }
        if ((this.alias == null && other.alias != null) || (this.alias != null && !this.alias.equals(other.alias))) {
            return false;
        }
        return true;
    }

    /**
     *
     * @see java.lang.Object#toString()
     * @return
     */
    @Override
    public String toString() {
        return "com.andersoncarlosfs.model.entities.AliasPK[ idPerson=" + idPerson + ", alias=" + alias + " ]";
    }

}
