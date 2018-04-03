package com.andersoncarlosfs.controller.beans;
import com.andersoncarlosfs.annotations.scopes.ApplicationScope;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;

/**
 *
 * @author Anderson Carlos Ferreira da Silva
 */
@ApplicationScope
public class NotificationBean {

    /**
     *
     * @param severity
     * @param message
     * @param detail
     */
    private static void addMessage(FacesMessage.Severity severity, String message) {
        FacesMessage facesMessage = new FacesMessage(severity, message, null);
        FacesContext.getCurrentInstance().addMessage(null, facesMessage);
    }

    /**
     *
     * @param exception
     * @param defaultMessage
     */
    public static void addErrorMessage(Exception exception, String defaultMessage) {
        String message = exception.getLocalizedMessage();
        if (message != null && message.length() > 0) {
            addMessage(FacesMessage.SEVERITY_ERROR, message);
        } else {
            addMessage(FacesMessage.SEVERITY_ERROR, defaultMessage);
        }
    }

    /**
     *
     * @param message
     */
    public static void addSuccessMessage(String message) {
        addMessage(FacesMessage.SEVERITY_INFO, message);
    }

}
