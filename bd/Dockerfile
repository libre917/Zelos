# Usar a imagem oficial do MySQL
FROM mysql:8.0

# Copiar o script SQL de inicialização para o diretório do container
COPY ./init.sql /docker-entrypoint-initdb.d/

# Definir o diretório de trabalho
WORKDIR /docker-entrypoint-initdb.d/

# Expor a porta 3306 para o MySQL
EXPOSE 3306
