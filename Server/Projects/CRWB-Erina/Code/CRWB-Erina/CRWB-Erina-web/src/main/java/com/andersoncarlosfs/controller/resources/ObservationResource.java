/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.controller.resources;

import com.andersoncarlosfs.controller.services.ObservationService;
import com.andersoncarlosfs.model.AbstractResource;
import com.andersoncarlosfs.model.benchmark.wrappers.ObservationWrapper;
import com.andersoncarlosfs.model.benchmark.wrappers.PictureWrapper;
import com.andersoncarlosfs.model.daos.ObservationDAO;
import com.andersoncarlosfs.model.entities.Observation;
import com.andersoncarlosfs.model.entities.Picture;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.Date;
import java.util.HashSet;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@RequestScoped
@Path("observation")
public class ObservationResource extends AbstractResource<ObservationService, ObservationDAO, ObservationWrapper, Observation, Long> {

    @Inject
    private ObservationService service;

    /**
     *
     * @return the service
     */
    @Override
    protected ObservationService getService() {
        return service;
    }
    
    @Override
    protected ObservationWrapper wrap(Observation entity, UriInfo context) {
        return new ObservationWrapper(entity, context);
    }

    /**
     * Create
     *
     * @param data
     * @throws java.io.IOException
     */
    @POST
    @Consumes(MediaType.APPLICATION_OCTET_STREAM)
    @Produces(MediaType.TEXT_PLAIN)
    public String create(byte[] data, @Context UriInfo context) throws IOException, InterruptedException {
        java.nio.file.Path path = Files.createTempFile(null, null);
        File file = path.toFile();
        FileOutputStream stream = new FileOutputStream(file);
        stream.write(data);
        stream.close();
        ProcessBuilder builder = new ProcessBuilder("python", "/home/fandres/scripts/predict.py", path.toAbsolutePath().toString());
        Process process = builder.start();
        process.waitFor();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }
        file.delete();
        Picture picture = new Picture(data, new HashSet<Observation>());
        Observation observation = new Observation(output.toString(), new Date(), picture);
        picture.getObservations().add(observation);
        getService().getDAO().create(observation);
        return context.getAbsolutePathBuilder().path(observation.getPrimaryKey().toString()).build().toString();
    }

    /**
     * Create
     *
     * @throws IOException
     */
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public String create(@FormDataParam("file") InputStream stream, @FormDataParam("file") FormDataContentDisposition details, @Context UriInfo context) throws IOException, InterruptedException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int read = 0;
        byte[] data = new byte[4096];
        while ((read = stream.read(data, 0, data.length)) > 0) {
            buffer.write(data, 0, read);
        }
        buffer.flush();
        stream.close();
        return create(buffer.toByteArray(), context);
    }

}
