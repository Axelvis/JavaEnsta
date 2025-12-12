package com.ensta.myfilmlist.exception;

/**
 * Represente une exception lors des traitements dans la couche de service.
 */
public class ServiceException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructeur par defaut.
	 */
	public ServiceException() {
	}

	/**
	 * Constructeur permettant d'ajouter un message specifique.
	 * 
	 * @param msg le message a ajouter
	 */
	public ServiceException(String msg) {
		super(msg);
	}

	/**
	 * Constructeur permettant de propager l'exception.
	 * 
	 * @param e l'exception d'origine
	 */
	public ServiceException(Throwable e) {
		super(e);
	}

	/**
	 * Constructeur permettant d'ajouter un message specifique et de transferer l'exception d'origine.
	 * 
	 * @param msg le message a ajouter
	 * @param e l'exception d'origine
	 */
	public ServiceException(String msg, Throwable e) {
		super(msg, e);
	}

}