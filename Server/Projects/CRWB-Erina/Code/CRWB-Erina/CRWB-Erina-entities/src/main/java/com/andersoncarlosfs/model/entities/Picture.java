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
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
@Entity
@Table(name = "pictures", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Picture.findAll", query = "SELECT p FROM Picture p"),
    @NamedQuery(name = "Picture.findByIdPicture", query = "SELECT p FROM Picture p WHERE p.idPicture = :idPicture")})
public class Picture extends AbstractEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pictures_id_picture_seq")
    @SequenceGenerator(name = "pictures_id_picture_seq", allocationSize = 1, sequenceName = "pictures_id_picture_seq")
    @Basic(optional = false)
    @Column(name = "id_picture", nullable = false)
    private Long idPicture;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Column(nullable = false)
    private byte[] data;
    @ManyToMany(cascade = {CascadeType.REFRESH}, mappedBy = "pictures", fetch = FetchType.LAZY)
    private Collection<Person> persons;
    @OneToMany(cascade = {CascadeType.REFRESH}, mappedBy = "picture")
    private Collection<Observation> observations;

    public Picture() {
    }

    public Picture(Long idPicture) {
        this.idPicture = idPicture;
    }

    public Picture(Long idPicture, byte[] data) {
        this.idPicture = idPicture;
        this.data = data;
    }

    public Picture(byte[] data) {
        this.data = data;
    }  
    
    public Picture(byte[] data, Collection<Observation> observations) {
        this.data = data;
        this.observations = observations;
    }  
    
    /**
     *
     * @return the idPicture
     */
    @XmlTransient
    public Long getIdPicture() {
        return idPicture;
    }

    /**
     *
     * @param idPicture the idPicture to set
     */
    public void setIdPicture(Long idPicture) {
        this.idPicture = idPicture;
    }

  /**
     *
     * @return the data
     */
    public byte[] getData() {
        return data;
    }

    /**
     *
     * @param data the data to set
     */
    public void setData(byte[] data) {
        this.data = data;
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
     * @return the observation
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
     * @return the idPicture
     */
    @XmlElement(name = "id")
    @Override
    public Long getPrimaryKey() {
        return idPicture;
    }

}
