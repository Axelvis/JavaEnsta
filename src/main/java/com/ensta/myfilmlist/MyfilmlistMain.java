package com.ensta.myfilmlist;

/**
 * Classe principale pour executer un traitement et s'arreter ensuite.
 */
public class MyfilmlistMain {

	public static void main(String[] args) {
		MyfilmlistTests myFilmListTests = new MyfilmlistTests();

		// Initialisation du Contexte Spring
		// AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
		// context.register(MyfilmlistTests.class);
		// context.scan("com.ensta.myfilmlist.*");
		// context.refresh();
		// MyfilmlistTests myFilmListTests = context.getBean(MyfilmlistTests.class);

		// Demarrage de la base de donnees
		// ConnectionManager.initDatabase();
		// ConnectionManager.testConnection();
		// ConnectionManager.createWebServer();

		System.out.println("--------------------");
		myFilmListTests.updateRealisateurCelebreTest();

		System.out.println("--------------------");
		myFilmListTests.calculerDureeTotaleTest();

		System.out.println("--------------------");
		myFilmListTests.calculerNoteMoyenneTest();

		System.out.println("--------------------");
		myFilmListTests.findAllFilmsTest();

		System.out.println("--------------------");
		myFilmListTests.createFilmTest();

		System.out.println("--------------------");
		myFilmListTests.findFilmByIdTest();

		System.out.println("--------------------");
		myFilmListTests.deleteFilmByIdTest();

		System.out.println("--------------------");
		myFilmListTests.updateRealisateurCelebre();
	}

}
