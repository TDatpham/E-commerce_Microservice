# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Accept service name as argument
ARG SERVICE_NAME

# Copy the parent pom
COPY pom.xml .

# Copy all modules' pom files to handle dependencies (easier than copying selectively)
COPY api-gateway/pom.xml api-gateway/
COPY discovery-service/pom.xml discovery-service/
COPY product-service/pom.xml product-service/
COPY user-service/pom.xml user-service/
COPY order-service/pom.xml order-service/

# Install parent and cache dependencies
RUN mvn install -N -DskipTests

# Copy the source of the target service
COPY ${SERVICE_NAME}/src ${SERVICE_NAME}/src

# Build the specific module
RUN mvn -pl ${SERVICE_NAME} clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app

ARG SERVICE_NAME
ARG PORT

COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar

ENV SERVER_PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT ["java","-jar","app.jar"]
