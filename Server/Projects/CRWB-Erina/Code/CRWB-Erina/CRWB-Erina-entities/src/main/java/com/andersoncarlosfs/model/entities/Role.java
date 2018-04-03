/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import com.andersoncarlosfs.model.AbstractEntity;
import java.io.Serializable;
import java.util.Collection;
import javax.enterprise.context.RequestScoped;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
@Entity
@Table(name = "roles", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Role.findAll", query = "SELECT r FROM Role r"),
    @NamedQuery(name = "Role.findByIdRole", query = "SELECT r FROM Role r WHERE r.idRole = :idRole"),
    @NamedQuery(name = "Role.findByName", query = "SELECT r FROM Role r WHERE r.name = :name")})
public class Role extends AbstractEntity<Short> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roles_id_role_seq")
    @SequenceGenerator(name = "roles_id_role_seq", allocationSize = 1, sequenceName = "roles_id_role_seq")
    @Basic(optional = false)
    @Column(name = "id_role", nullable = false)
    private Short idRole;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "name", nullable = true, length = 2147483647)
    private String name;
    @Size(max = 2147483647)
    @Column(name = "description", nullable = true, length = 2147483647)
    private String description;
    @JoinTable(name = "persons_roles", joinColumns = {
        @JoinColumn(name = "id_role", referencedColumnName = "id_role", nullable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "id_person", referencedColumnName = "id_person", nullable = false)})
    @ManyToMany(fetch = FetchType.LAZY)
    private Collection<Person> persons;

    public Role() {
    }

    public Role(Short idRole) {
        this.idRole = idRole;
    }

    public Role(String name) {
        this.name = name;
    }

    public Role(Short idRole, String name) {
        this.idRole = idRole;
        this.name = name;
    }

    /**
     *
     * @return the idRole
     */
    public Short getIdRole() {
        return idRole;
    }

    /**
     *
     * @param idRole the idRole to set
     */
    public void setIdRole(Short idRole) {
        this.idRole = idRole;
    }

    /**
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * 
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * 
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     *
     * @return the persons
     */
    @XmlTransient
    public Collection<Person> getPersons() {
        return persons;
    }

    /**
     *
     * @param persons the persons to set
     */
    public void setPersons(Collection<Person> persons) {
        this.persons = persons;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idRole
     */
    @Override
    public Short getPrimaryKey() {
        return idRole;
    }

}
