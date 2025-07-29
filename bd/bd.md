# Rodar o BD MySQL no Docker
Segue guia para rodar o bacno de dados MySQL no Docker. Essa é uma facilidade para quem já sabe docker ou tem disponibilidade e quer aprender. Não é requisito para o projeto e não será instruído em sala de aula. Se já tem MySQL instalado e rodando vai dar conflito e o container não vai operar corretamente. 

### Contruindo a imagem
```bash
docker build -t zelos-mysql .
```

### Rodando o container
```bash
docker run -d --name zelos-db -e MYSQL_ROOT_PASSWORD="senai@123" -e MYSQL_DATABASE=zelos -e MYSQL_USER=zelos_user -e MYSQL_PASSWORD="senai@123" -p 3306:3306 zelos-mysql
```

### Acessando o shell do MySQL
```bash
docker exec -it zelos-db mysql -u zelos_user -p
```
