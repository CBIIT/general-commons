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
FROM tomcat:10.1.56-jre25 AS fnl_base_image
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
RUN apt update \
    ## list upgradable packages in build log, useful for patching
    && apt list --upgradable \
    ## library specific patches
    && apt install -y libgnutls30t64=3.8.3-1.1ubuntu3.6 \
    && apt install -y perl-base=5.38.2-3.2ubuntu0.3 \
    && apt install -y tar=1.35+dfsg-3ubuntu0.2 \
    && apt install -y libsystemd0=255.4-1ubuntu8.16 \
    && apt install -y libgcrypt20=1.10.3-2ubuntu0.1 \
    && apt install -y liblzma5=5.6.1+really5.4.5-1ubuntu0.3 \
    && apt install -y libtinfo6=6.4+20240113-1ubuntu2.1 \
    && apt install -y gzip=1.12-1ubuntu3.2
# switch to nonroot user
USER nonrootuser
