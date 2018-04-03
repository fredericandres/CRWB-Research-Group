/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import com.andersoncarlosfs.model.AbstractEntity;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author anderson
 */
@Entity
@Table(name = "observations", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Observation.findAll", query = "SELECT o FROM Observation o"), 
    @NamedQuery(name = "Observation.findByIdObservation", query = "SELECT o FROM Observation o WHERE o.idObservation = :idObservation"), 
    @NamedQuery(name = "Observation.findByText", query = "SELECT o FROM Observation o WHERE o.text = :text"), 
    @NamedQuery(name = "Observation.findByDate", query = "SELECT o FROM Observation o WHERE o.date = :date")})
public class Observation extends AbstractEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_observation", nullable = false)
    private Long idObservation;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(nullable = false, length = 2147483647)
    private String text;
    @Basic(optional = false)
    @NotNull
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    @JoinColumn(name = "id_natural_person", referencedColumnName = "id_natural_person")
    @ManyToOne(fetch = FetchType.LAZY)
    private NaturalPerson naturalPerson;
    @OneToMany(mappedBy = "observation", fetch = FetchType.LAZY)
    private Collection<Observation> details;
    @JoinColumn(name = "id_observation_detail", referencedColumnName = "id_observation")
    @ManyToOne(fetch = FetchType.LAZY)
    private Observation observation;
    @JoinColumn(name = "id_picture", referencedColumnName = "id_picture", nullable = false)
    @ManyToOne(optional = false, cascade = {CascadeType.PERSIST, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    private Picture picture;

    public Observation() {
    }

    public Observation(Long idObservation) {
        this.idObservation = idObservation;
    }

    public Observation(Long idObservation, String text, Date date) {
        this.idObservation = idObservation;
        this.text = text;
        this.date = date;
    }
    
    public Observation(String text, Date date, Picture picture) {
        this.text = text;
        this.date = date;
        this.picture = picture;
    }

    /**
     * 
     * @return the idObservation
     */
    @XmlTransient
    public Long getIdObservation() {
        return idObservation;
    }

    /**
     * 
     * @param idObservation the idObservation to set
     */
    public void setIdObservation(Long idObservation) {
        this.idObservation = idObservation;
    }

    /**
     * 
     * @return the text
     */
    public String getText() {
        return text;
    }

    /**
     * 
     * @param text the text to set
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * 
     * @return the date
     */
    public Date getDate() {
        return date;
    }

    /**
     * 
     * @param date the date to set
     */
    public void setDate(Date date) {
        this.date = date;
    }

    /**
     * 
     * @return the naturalPerson
     */
    public NaturalPerson getNaturalPerson() {
        return naturalPerson;
    }

    /**
     * 
     * @param naturalPerson the naturalPerson to set
     */
    public void setNaturalPerson(NaturalPerson naturalPerson) {
        this.naturalPerson = naturalPerson;
    }

    /**
     * 
     * @return the details
     */
    @XmlTransient
    public Collection<Observation> getDetails() {
        return details;
    }

    /**
     * 
     * @param details the details to set
     */
    public void setDetail(Collection<Observation> details) {
        this.details = details;
    }

    /**
     * 
     * @return the observation
     */
    public Observation getObservation() {
        return observation;
    }

    /**
     * 
     * @param observation the observation to set
     */
    public void setObservation(Observation observation) {
        this.observation = observation;
    }

    /**
     * 
     * @return the picture
     */
    public Picture getPicture() {
        return picture;
    }

    /**
     * 
     * @param picture the picture to set
     */
    public void setPicture(Picture picture) {
        this.picture = picture;
    }

    /**
     *
     * @see AbstractEntity#getPrimaryKey()
     * @return the idObservation
     */
    @XmlElement(name = "id")
    @Override
    public Long getPrimaryKey() {
        return idObservation;
    }
    
}
