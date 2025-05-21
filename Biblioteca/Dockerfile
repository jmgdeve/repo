# Usa tomcat como base
FROM tomcat:10-jdk21

# elimina la aplicación por defecto de Tomcat
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copia el archivo war generado por maven al contenedor
COPY target/Biblioteca.war /usr/local/tomcat/webapps/ROOT.war

# Expone el puerto 8080
EXPOSE 8080

# Inicia tomcat
CMD ["catalina.sh", "run"]