# Build stage
FROM maven:3.9.16-eclipse-temurin-25-noble AS build
WORKDIR /usr/src/app
# download dependencies
COPY pom.xml .
RUN mvn -B dependency:go-offline dependency:resolve-plugins -DskipTests
# copy source code and build the project
COPY src ./src
RUN mvn -B package -DskipTests

# Production stage
FROM tomcat:11.0.25-jre25 AS fnl_base_image
# set environment variables
ENV JAVA_OPTS="-XX:InitialRAMPercentage=25 -XX:MaxRAMPercentage=70"
ENV TZ="America/New_York"
EXPOSE 8080
# remove existing webapps (including examples), copy the new war file, and run as non-root
RUN useradd -r nonrootuser && rm -rf /usr/local/tomcat/webapps/*
# copy the war file
COPY --from=build /usr/src/app/target/CDS-*.war /usr/local/tomcat/webapps/ROOT.war
# change ownership of the tomcat directory to the nonroot user
RUN chown -R nonrootuser:nonrootuser /usr/local/tomcat
# patch vulnerable base image packages
RUN apt-get update && apt-get install -y --no-install-recommends --only-upgrade \
    apt=2.8.4ubuntu0.1 \
    libapt-pkg6.0t64=2.8.4ubuntu0.1 \
    libpcre2-8-0=10.42-4ubuntu2.2 \
    && rm -rf /var/lib/apt/lists/*
# switch to nonroot user
USER nonrootuser
