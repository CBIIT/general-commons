ARG ECR_REPO
FROM maven:3.9.16-eclipse-temurin-17-noble AS build
WORKDIR /usr/src/app
COPY . .
#COPY backend/ .
RUN mvn package -DskipTests

# Stage 2: Production
FROM tomcat:10.1.56-jdk25 AS fnl_base_image
ENV JAVA_OPTS="$JAVA_OPTS -XX:InitialRAMPercentage=25 -XX:MaxRAMPercentage=70"
ENV TZ="America/New_York"
RUN rm -rf /usr/local/tomcat/webapps/ROOT
RUN apt update && apt upgrade -y
COPY --from=build /usr/src/app/target/CDS-2.2.0.war /usr/local/tomcat/webapps/ROOT.war
