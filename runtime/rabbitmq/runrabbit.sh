docker run -d --hostname muon-rabbit --name rabbit-muon -e RABBITMQ_DEFAULT_USER=muon -e RABBITMQ_DEFAULT_PASS=microservices -p 15672:15672 -p 5672:5672 rabbitmq:3.5.4-management
