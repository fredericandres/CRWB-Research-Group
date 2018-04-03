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
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
//@Access(AccessType.FIELD)
@Table(name = "natural_persons", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "NaturalPerson.findAll", query = "SELECT n FROM NaturalPerson n"),
    @NamedQuery(name = "NaturalPerson.findByIdNaturalPerson", query = "SELECT n FROM NaturalPerson n WHERE n.idNaturalPerson = :idNaturalPerson"),
    @NamedQuery(name = "NaturalPerson.findByName", query = "SELECT n FROM NaturalPerson n WHERE n.name = :name"),
    @NamedQuery(name = "NaturalPerson.findBySurname", query = "SELECT n FROM NaturalPerson n WHERE n.surname = :surname")})
public class NaturalPerson extends AbstractEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "id_natural_person", nullable = false)
    private Long idNaturalPerson;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(nullable = false, length = 2147483647)
    private String name;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(nullable = false, length = 2147483647)
    private String surname;
    @MapsId("id_person")
    @JoinColumn(name = "id_natural_person", referencedColumnName = "id_person", nullable = false)
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Person person;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "naturalPerson", fetch = FetchType.LAZY)
    private Account account;
    @OneToMany(mappedBy = "naturalPerson")
    private Collection<Observation> observations;

    public NaturalPerson() {
    }

    public NaturalPerson(Person person) {
        this.person = person;
    }

    public NaturalPerson(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }

    public NaturalPerson(Long idNaturalPerson, String name, String surname) {
        this.idNaturalPerson = idNaturalPerson;
        this.name = name;
        this.surname = surname;
    }

    public NaturalPerson(String name, String surname, Person person) {
        this.name = name;
        this.surname = surname;
        this.person = person;
    }

    /**
     *
     * @return the idNaturalPerson
     */
    public Long getIdNaturalPerson() {
        return idNaturalPerson;
    }

    /**
     *
     * @param idNaturalPerson the idNaturalPerson to set
     */
    public void setIdNaturalPerson(Long idNaturalPerson) {
        this.idNaturalPerson = idNaturalPerson;
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
     * @return the surname
     */
    public String getSurname() {
        return surname;
    }

    /**
     *
     * @param surname the surname to set
     */
    public void setSurname(String surname) {
        this.surname = surname;
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
     * @return the account
     */
    //@Access(AccessType.PROPERTY)
    //@OneToOne(cascade = CascadeType.ALL, mappedBy = "naturalPerson")
    public Account getAccount() {
        return account;
    }

    /**
     *
     * @param account the account to set
     */
    public void setAccount(Account account) {
        this.account = account;
    }
    
    /**
     * 
     * @return the observations
     */
    @XmlTransient
    public Collection<Observation> getObservations() {
        return observations;
    }
    
    /**
     * 
     * @param observations the observations to set
     */
    public void setObservations(Collection<Observation> observations) {
        this.observations = observations;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idNaturalPerson
     */
    @Override
    public Long getPrimaryKey() {
        return idNaturalPerson;
    }

}
