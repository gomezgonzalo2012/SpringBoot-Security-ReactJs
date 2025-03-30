FROM openjdk:21-jdk-slim
ARG JAR_FILE=target/TheCentralHotel-0.0.1-SNAPSHOT.jar 
COPY ${JAR_FILE} /usr/share/TheCentralHotel-0.0.1-SNAPSHOT.jar
EXPOSE 8080
CMD ["java", "-jar", "/usr/share/TheCentralHotel-0.0.1-SNAPSHOT.jar"]