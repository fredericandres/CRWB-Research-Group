/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.benchmark.wrappers;

import com.andersoncarlosfs.model.AbstractWrapperTest;
import com.andersoncarlosfs.model.entities.Observation;
import com.andersoncarlosfs.model.entities.Picture;
import java.util.Date;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
public class ObservationWrapperTest extends AbstractWrapperTest<ObservationWrapper, Observation, Long> {

    private final ObservationWrapper object = new ObservationWrapper(new Observation("Text", new Date(), new Picture()));

    @Override
    public ObservationWrapper getObject() {
        return object;
    }

}
