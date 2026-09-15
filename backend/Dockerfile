# Build stage
FROM maven:3.9.16-eclipse-temurin-17-noble AS build
WORKDIR /usr/src/app
# download dependencies
COPY pom.xml .
RUN mvn -B dependency:go-offline dependency:resolve-plugins -DskipTests
# copy source code and build the project
COPY src ./src
RUN mvn -B package -DskipTests

# Production stage
FROM tomcat:10.1.59-jre25-temurin-noble AS fnl_base_image
# set environment variables
ENV JAVA_OPTS="-XX:InitialRAMPercentage=25 -XX:MaxRAMPercentage=70"
ENV TZ="America/New_York"
EXPOSE 8080
# remove existing webapps, copy the new war file, and run as non-root
RUN useradd -r nonrootuser && rm -rf /usr/local/tomcat/webapps/ROOT
# copy the war file
COPY --from=build /usr/src/app/target/CDS-*.war /usr/local/tomcat/webapps/ROOT.war
# change ownership of the tomcat directory to the nonroot user
RUN chown -R nonrootuser:nonrootuser /usr/local/tomcat
# base image patching
RUN apt-get update && apt-get install -y --only-upgrade --no-install-recommends \
    coreutils \
    gpgv \
    libbz2-1.0 \
    libgcrypt20 \
    libncursesw6 \
    libssl3t64 \
    libtinfo6 \
    ncurses-base \
    ncurses-bin \
    openssl \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*
# switch to nonroot user
USER nonrootuser
