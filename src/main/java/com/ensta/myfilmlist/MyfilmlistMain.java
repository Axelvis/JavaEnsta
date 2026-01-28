package com.ensta.myfilmlist;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.ensta.myfilmlist.persistence.ConnectionManager;


public class MyfilmlistMain {

	public static void main(String[] args) {

		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
		context.register(MyfilmlistTests.class);
		context.scan("com.ensta.myfilmlist.*");
		context.refresh();
		MyfilmlistTests myFilmListTests = context.getBean(MyfilmlistTests.class);

		ConnectionManager.initDatabase();

		System.out.println("--------------------");
		myFilmListTests.updateRealisateurCelebreTest();

		System.out.println("--------------------");
		myFilmListTests.calculerDureeTotaleTest();
		
		context.close();

		System.out.println("--------------------");
		myFilmListTests.calculerNoteMoyenneTest();

		System.out.println("--------------------");
		myFilmListTests.updateRealisateurCelebresTest();

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

		System.out.println("--------------------");
		myFilmListTests.createRealisateurTest();
	}

}
