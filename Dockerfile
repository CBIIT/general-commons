ARG ECR_REPO
FROM maven:3.9.6-eclipse-temurin-17 as build
WORKDIR /usr/src/app
COPY . .
RUN mvn package -DskipTests
# Stage 2: Production
FROM tomcat:10.1.24-jdk17-temurin-jammy as fnl_base_image
ENV JAVA_OPTS $JAVA_OPTS -XX:InitialRAMPercentage=25 -XX:MaxRAMPercentage=70
ENV TZ America/New_York

RUN apt-get update && apt-get install -y unzip  

RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY --from=build /usr/src/app/target/CDS-0.0.1.war /usr/local/tomcat/webapps/ROOT.war