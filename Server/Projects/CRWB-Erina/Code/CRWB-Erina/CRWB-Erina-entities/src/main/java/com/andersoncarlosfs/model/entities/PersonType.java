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
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
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
@Table(name = "person_types", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "PersonType.findAll", query = "SELECT p FROM PersonType p"),
    @NamedQuery(name = "PersonType.findByIdPersonType", query = "SELECT p FROM PersonType p WHERE p.idPersonType = :idPersonType"),
    @NamedQuery(name = "PersonType.findByName", query = "SELECT p FROM PersonType p WHERE p.name = :name"),
    @NamedQuery(name = "PersonType.findByDescription", query = "SELECT p FROM PersonType p WHERE p.description = :description")})
public class PersonType extends AbstractEntity<Short> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "person_types_id_person_type_seq")
    @SequenceGenerator(name = "legal_persons_id_legal_person_seq", allocationSize = 1, sequenceName = "person_types_id_person_type_seq")
    @Basic(optional = false)
    @Column(name = "id_person_type", nullable = false)
    private Short idPersonType;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "name", nullable = false, length = 2147483647)
    private String name;
    @Size(max = 2147483647)
    @Column(name = "description", nullable = true, length = 2147483647)
    private String description;
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "personType", fetch = FetchType.LAZY)
    private Collection<Person> persons;

    public PersonType() {
    }

    public PersonType(Short idPersonType) {
        this.idPersonType = idPersonType;
    }

    public PersonType(Short idPersonType, String name) {
        this.idPersonType = idPersonType;
        this.name = name;
    }

    /**
     * 
     * @return the idPersonType
     */
    public Short getIdPersonType() {
        return idPersonType;
    }

    /**
     * 
     * @param idPersonType the idPersonType to set
     */
    public void setIdPersonType(Short idPersonType) {
        this.idPersonType = idPersonType;
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
     * @return the idLegalPerson
     */
    @Override
    public Short getPrimaryKey() {
        return idPersonType;
    }
    
}
