FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/
RUN mvn install -N -DskipTests
COPY api-gateway/src api-gateway/src
RUN mvn -pl api-gateway clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
