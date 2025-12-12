package com.ensta.myfilmlist.exception;

/**
 * Represente une exception lors des traitements dans la couche de controller.
 */
public class ControllerException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Constructeur par defaut.
	 */
	public ControllerException() {
	}

	/**
	 * Constructeur permettant d'ajouter un message specifique.
	 * 
	 * @param msg le message a ajouter
	 */
	public ControllerException(String msg) {
		super(msg);
	}

	/**
	 * Constructeur permettant de propager l'exception.
	 * 
	 * @param e l'exception d'origine
	 */
	public ControllerException(Throwable e) {
		super(e);
	}

	/**
	 * Constructeur permettant d'ajouter un message specifique et de transferer l'exception d'origine.
	 * 
	 * @param msg le message a ajouter
	 * @param e l'exception d'origine
	 */
	public ControllerException(String msg, Throwable e) {
		super(msg, e);
	}

}