/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.andersoncarlosfs.model.benchmark;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author anderson
 */
@XmlRootElement
public class Prediction {
    
    private String text;
    private Long accuracy;

    public Prediction() {
    }

    public Prediction(String text, Long accuracy) {
        this.text = text;
        this.accuracy = accuracy;
    }

    /**
     * @return the text
     */
    public String getText() {
        return text;
    }

    /**
     * @param text the text to set
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * @return the accuracy
     */
    public Long getAccuracy() {
        return accuracy;
    }

    /**
     * @param accuracy the accuracy to set
     */
    public void setAccuracy(Long accuracy) {
        this.accuracy = accuracy;
    }
    
}
