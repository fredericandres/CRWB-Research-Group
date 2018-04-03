/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.entities;

import com.andersoncarlosfs.model.AbstractEntity;
import java.io.Serializable;
import javax.enterprise.context.RequestScoped;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
@Entity
@Table(name = "accounts", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Account.findAll", query = "SELECT a FROM Account a"),
    @NamedQuery(name = "Account.findByIdAccount", query = "SELECT a FROM Account a WHERE a.idAccount = :idAccount"),
    @NamedQuery(name = "Account.findByPassword", query = "SELECT a FROM Account a WHERE a.password = :password")})
public class Account extends AbstractEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "id_account", nullable = false)
    private Long idAccount;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(nullable = false, length = 2147483647)
    private String password;
    @MapsId("id_natural_person")
    @JoinColumn(name = "id_account", referencedColumnName = "id_natural_person", nullable = false)
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private NaturalPerson naturalPerson;

    public Account() {
    }

    public Account(Long idAccount) {
        this.idAccount = idAccount;
    }

    public Account(NaturalPerson naturalPerson) {
        this.naturalPerson = naturalPerson;
    }

    public Account(String password) {
        this.password = password;
    }

    public Account(Long idAccount, String password) {
        this.idAccount = idAccount;
        this.password = password;
    }

    public Account(String password, NaturalPerson naturalPerson) {
        this.password = password;
        this.naturalPerson = naturalPerson;
    }

    /**
     *
     * @return the idAccount
     */
    public Long getIdAccount() {
        return idAccount;
    }

    /**
     *
     * @param idAccount the idAccount to set
     */
    public void setIdAccount(Long idAccount) {
        this.idAccount = idAccount;
    }

    /**
     *
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     *
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
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
     * @see AbstractEntity#getPrimaryKey()
     * @return the idAccount
     */
    @Override
    public Long getPrimaryKey() {
        return idAccount;
    }

}
