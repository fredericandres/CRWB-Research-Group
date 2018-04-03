/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.spi.PersistenceUnitTransactionType;
import static org.eclipse.persistence.config.PersistenceUnitProperties.*;
import org.eclipse.persistence.config.TargetDatabase;
import org.eclipse.persistence.config.TargetServer;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 * @param <S>
 * @param <T>
 */
public abstract class AbstractPersistenceTest<S extends AbstractEntity<T>, T extends Comparable<T>> {

    private static EntityManagerFactory emf;
    private EntityManager em;

    /**
     *
     * @throws java.lang.Exception
     */
    @BeforeClass
    public static void setUpClass() throws Exception {
        Map properties = new HashMap();

        // Ensure RESOURCE_LOCAL transactions is used
        properties.put(TRANSACTION_TYPE, PersistenceUnitTransactionType.RESOURCE_LOCAL.name());

        // Configure the internal EclipseLink connection pool
        properties.put(JDBC_DRIVER, "org.postgresql.Driver");
        properties.put(JDBC_URL, "jdbc:postgresql://192.168.56.101:5432/CRWB");
        properties.put(JDBC_USER, "postgres");
        properties.put(JDBC_PASSWORD, "postgres");

        properties.put(TARGET_DATABASE, TargetDatabase.PostgreSQL);

        // Configure logging. FINE ensures all SQL is shown
        properties.put(LOGGING_LEVEL, Level.FINE.toString());
        properties.put(LOGGING_TIMESTAMP, Boolean.TRUE.toString());
        properties.put(LOGGING_THREAD, Boolean.TRUE.toString());
        properties.put(LOGGING_SESSION, Boolean.TRUE.toString());

        // Ensure that any remaining database artifacts will be deleted and then create the artifacts when the application is deployed
        //properties.put(SCHEMA_GENERATION_DATABASE_ACTION, "drop-and-create");
        // Populate the database tables with data before the application loads
        //properties.put(SCHEMA_GENERATION_SQL_LOAD_SCRIPT_SOURCE, "META-INF/scripts/sql/data.sql");
        // Ensure that no server-platform is configured
        properties.put(TARGET_SERVER, TargetServer.None);

        Map persistenceUnits = new HashMap();
        persistenceUnits.put("CRWBPU", properties);

        Map compositePU = new HashMap();

        // Ensure RESOURCE_LOCAL transactions is used
        compositePU.put(TRANSACTION_TYPE, PersistenceUnitTransactionType.RESOURCE_LOCAL.name());

        // Configure the Composite Persistence Unit
        compositePU.put(COMPOSITE_UNIT, Boolean.TRUE.toString());
        compositePU.put(COMPOSITE_UNIT_PROPERTIES, persistenceUnits);
        // Ensure that no server-platform is configured
        compositePU.put(TARGET_SERVER, TargetServer.None);

        emf = Persistence.createEntityManagerFactory("CRWBPU", properties);
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @AfterClass
    public static void tearDownClass() throws Exception {
        emf.close();
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        em = emf.createEntityManager();
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @After
    public void tearDown() throws Exception {
        em.close();
    }

    /**
     *
     * @return
     */
    public abstract Class getClasse();

    /**
     *
     * @return
     */
    public abstract S getObject();

    /**
     *
     */
    public abstract void modifyObject();

    /**
     *
     */
    @Test
    public void testCount() {
        System.out.println("Started testCount");
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery cq = cb.createQuery();
        cq.select(cb.count(cq.from(getClasse())));
        System.out.println("Count=" + em.createQuery(cq).getSingleResult());
        System.out.println("Finalized testCount");
    }

    /**
     *
     * @throws java.lang.Exception
     */
    @Test
    public void testPersistence() throws Exception {
        System.out.println("Started testPersistence");
        em.getTransaction().begin();
        em.persist(getObject());
        em.find(getClasse(), getObject().getPrimaryKey());
        modifyObject();
        em.merge(getObject());
        em.remove(getObject());
        em.getTransaction().commit();
        em.clear();
        System.out.println("Object=" + getObject().toXML());
        System.out.println("Finalized testPersistence");
    }

}
