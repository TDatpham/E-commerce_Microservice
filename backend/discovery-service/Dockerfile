FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY discovery-service/pom.xml discovery-service/
RUN mvn install -N -DskipTests
COPY discovery-service/src discovery-service/src
RUN mvn -pl discovery-service clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/discovery-service/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","app.jar"]
