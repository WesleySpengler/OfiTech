FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' mvnw
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]