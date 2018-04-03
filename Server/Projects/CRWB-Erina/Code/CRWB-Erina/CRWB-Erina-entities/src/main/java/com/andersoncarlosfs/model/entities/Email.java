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
@Table(name = "emails", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Emails.findAll", query = "SELECT e FROM Email e"),
    @NamedQuery(name = "Emails.findByIdEmail", query = "SELECT e FROM Email e WHERE e.idEmail = :idEmail"),
    @NamedQuery(name = "Emails.findByEmail", query = "SELECT e FROM Email e WHERE e.email = :email")})
public class Email extends AbstractEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emails_id_email_seq")
    @SequenceGenerator(name = "emails_id_email_seq", allocationSize = 1, sequenceName = "emails_id_email_seq")
    @Basic(optional = false)
    @Column(name = "id_email", nullable = false)
    private Long idEmail;
    // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "email", nullable = false, length = 2147483647)
    private String email;
    @ManyToMany(mappedBy = "emails", fetch = FetchType.LAZY)
    private Collection<Person> persons;

    public Email() {
    }

    public Email(Long idEmail) {
        this.idEmail = idEmail;
    }

    public Email(Long idEmail, String email) {
        this.idEmail = idEmail;
        this.email = email;
    }

    /**
     *
     * @return the idEmail
     */
    public Long getIdEmail() {
        return idEmail;
    }

    /**
     *
     * @param idEmail the idEmail to set
     */
    public void setIdEmail(Long idEmail) {
        this.idEmail = idEmail;
    }

    /**
     *
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     *
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
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
     * @return the idEmail
     */
    @Override
    public Long getPrimaryKey() {
        return idEmail;
    }

}
