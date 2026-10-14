# ---------- Stage 1: build the JAR with the Maven wrapper ----------
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Copy the wrapper and pom first so dependencies are cached between builds
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

# Copy the source and build (tests skipped: they need a database)
COPY src src
RUN ./mvnw -B -DskipTests package

# ---------- Stage 2: run the JAR on a smaller JRE image ----------
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# No port or secrets here: Render supplies PORT and SPRING_DATASOURCE_URL
ENTRYPOINT ["java", "-jar", "app.jar"]
