# Etapa 1: Build del frontend
FROM node:22.14.0-slim AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Definir las variables de entorno
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copiar dependencias y archivos necesarios
COPY package*.json ./
COPY postcss.config.js tailwind.config.js vite.config.js ./
COPY src ./src
COPY index.html ./

# Instalar dependencias y construir
RUN npm install
RUN npm run build

# Etapa 2: Servidor estático con NGINX
FROM nginx:alpine


# Copiar el build al directorio por defecto de NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
