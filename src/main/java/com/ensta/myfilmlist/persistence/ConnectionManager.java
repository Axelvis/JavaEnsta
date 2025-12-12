package com.ensta.myfilmlist.persistence;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;

/**
 * Gere l'initialisation et les connexions de la base de donnees H2 en memoire.
 */
public class ConnectionManager {

	private static final String H2_DB_URL = "jdbc:h2:mem:film;DB_CLOSE_DELAY=-1";

	private static final String H2_DB_USER = "sa";

	private static final String H2_DB_PASSWORD = "";

	private static final DataSource DATASOURCE;

	private static final JdbcTemplate JDBC_TEMPLATE;

	/**
	 * Initialise la base de donnees H2 en memoire.
	 */
	static {
		JdbcDataSource jdbcDataSource = new JdbcDataSource();
		jdbcDataSource.setURL(H2_DB_URL);
		jdbcDataSource.setUser(H2_DB_USER);
		jdbcDataSource.setPassword(H2_DB_PASSWORD);
		DATASOURCE = jdbcDataSource;
		JDBC_TEMPLATE = new JdbcTemplate(DATASOURCE);
	}

	/**
	 * Cree un serveur Web pour se connecter a la base de donnees a l'url http://localhost:8082.
	 */
	public static void createWebServer() {
		try {
			Server.createWebServer("-webPort", "8082").start();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Renvoie la datasource permettant de se connecter a la base de donnees.
	 * 
	 * @return Une {@link DataSource} pour se connecter a la base de donnees.
	 */
	public static DataSource getDataSource() {
		return DATASOURCE;
	}

	/**
	 * Renvoie le jdbcTemplate permettant de se connecter a la base de donnees
	 * 
	 * @return Une {@link JdbcTemplate} pour se connecter a la base de donnees.
	 */
	public static JdbcTemplate getJdbcTemplate() {
		return JDBC_TEMPLATE;
	}

	/**
	 * Initialise la base de donnees avec le scipt data.sql dans le classpath.
	 */
	public static void initDatabase() {
		changeSpringJdbcDebugLogToInfoLog();
		try (Connection connection = getDataSource().getConnection()) {
			ScriptUtils.executeSqlScript(connection, new ClassPathResource("data.sql"));
			System.out.println("Initialisation de la base de donnees effectuee avec succes");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Effectue le nettoyage de la base de donnees avec le scipt clean_data.sql dans le classpath.
	 */
	public static void clearDatabase() {
		try (Connection connection = getDataSource().getConnection()) {
			ScriptUtils.executeSqlScript(connection, new ClassPathResource("clean_data.sql"));
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester la connexion a la base de donnees.
	 */
	public static void testConnection() {
		try (Connection connection = getDataSource().getConnection()) {
			Statement stmt = connection.createStatement();

			ResultSet rs = stmt.executeQuery("SELECT * FROM FILM");
			while (rs.next()) {
				System.out.println(rs.getInt(1) + " : " + rs.getString(2) + " : " + rs.getInt(3));
			}

			System.out.println("Success!");
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Change le niveau des logs JDBC par defaut en INFO.
	 */
	private static void changeSpringJdbcDebugLogToInfoLog() {
		Logger logger = (Logger) LoggerFactory.getLogger("org.springframework.jdbc");
		logger.setLevel(Level.INFO);
	}

}
