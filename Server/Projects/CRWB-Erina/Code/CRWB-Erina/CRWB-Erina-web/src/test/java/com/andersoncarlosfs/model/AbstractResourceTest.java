/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import javax.ws.rs.Path;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Application;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.JerseyTest;
import org.glassfish.jersey.test.TestProperties;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S> the entity type
 * @param <T> the identifier type
 */
public abstract class AbstractResourceTest<S extends AbstractEntity<T>, T extends Comparable<T>> extends JerseyTest {

    /**
     *
     */
    @BeforeClass
    public static void setUpClass() {
    }

    /**
     *
     */
    @AfterClass
    public static void tearDownClass() {
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @After
    @Override
    public void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * 
     * @return 
     */
    @Override
    protected Application configure() {      
        enable(TestProperties.LOG_TRAFFIC);
        enable(TestProperties.DUMP_ENTITY);
        return new ResourceConfig(getResource());
    }

    
    /**
     *
     * @return 
     */
    protected WebTarget getTarget() {
        return target(((Path) getResource().getDeclaredAnnotation(Path.class)).value());
    }
    
    /**
     * 
     * @return
     */
    public abstract Class getResource();
    
    
    /**
     *
     * @return
     */
    public abstract S getObject();

    /**
     *
     */
    public abstract void modifyObject();

}
