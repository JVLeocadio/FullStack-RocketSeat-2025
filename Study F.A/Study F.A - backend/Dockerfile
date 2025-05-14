FROM node:18

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do backend
COPY . .

# Compile o TypeScript para JavaScript
RUN npm run build

# Certifique-se de que a pasta uploads existe
RUN mkdir -p uploads

# Exponha a porta do servidor
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "start"]