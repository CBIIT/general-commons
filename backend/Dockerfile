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
FROM tomcat:10.1.59-jre25 AS fnl_base_image
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
# base image patching for CDS-1728 CVEs
RUN apt-get update \
    && apt-get install -y --no-install-recommends --only-upgrade \
    bsdutils=1:2.39.3-9ubuntu6.6 \
    libblkid1=2.39.3-9ubuntu6.6 \
    libmount1=2.39.3-9ubuntu6.6 \
    libsmartcols1=2.39.3-9ubuntu6.6 \
    libuuid1=2.39.3-9ubuntu6.6 \
    mount=2.39.3-9ubuntu6.6 \
    util-linux=2.39.3-9ubuntu6.6 \
    diffutils=1:3.10-1ubuntu0.1 \
    libattr1=1:2.5.2-1ubuntu0.1 \
    && rm -rf /var/lib/apt/lists/*
# switch to nonroot user
USER nonrootuser
