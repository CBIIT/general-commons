# Build stage
ARG ECR_REPO
FROM maven:3.8.3-openjdk-17 as build
WORKDIR /usr/src/app
COPY . .
RUN mvn package -DskipTests

# Production stage
FROM ${ECR_REPO}/cbiit-base-docker-images:cds-backend-jdk17
RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY --from=build /usr/src/app/target/CDS-0.0.1.war /usr/local/tomcat/webapps/ROOT.war
COPY --from=build  /usr/src/app/tomcat/conf/error.jsp /usr/local/tomcat/webapps/error.jsp
# Create a script to modify the web.xml file
RUN echo '<error-page>' >> /usr/local/tomcat/conf/web.xml \
    && echo '  <exception-type>java.lang.Throwable</exception-type>' >> /usr/local/tomcat/conf/web.xml \
    && echo '  <location>/error.jsp</location>' >> /usr/local/tomcat/conf/web.xml \
    && echo '</error-page>' >> /usr/local/tomcat/conf/web.xml