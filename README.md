# Mi Aplicación - Stack Completo

Esta aplicación está compuesta por un frontend y backend que pueden desplegarse de dos formas diferentes: usando Docker Compose para desarrollo local o usando Ansible para despliegue automatizado en servidores Linux Debian 13.

## 📋 Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Opción 1: Despliegue con Docker Compose](#opción-1-despliegue-con-docker-compose)
- [Opción 2: Despliegue Automatizado con Ansible](#opción-2-despliegue-automatizado-con-ansible)
- [Capturas de la Aplicación](#capturas-de-la-aplicación)

## 🏗️ Arquitectura del Proyecto

```
TALLER_DOCKER_COMPOSE/
├── ansible-hostname-timezone/     # Configuración de Ansible
├── backProducts/                  # Servicio Backend
├── frontProducts/                 # Servicio Frontend  
└── docker-compose.yml            # Orquestación de contenedores
```

La aplicación consta de:
- **Frontend**: Interfaz de usuario para gestión de productos
- **Backend**: API REST para operaciones CRUD de productos
- **Base de datos**: PostgreSQL

---

## 🔧 Requisitos Previos

### Para Docker Compose:
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

### Para Ansible:
- Ansible 2.9+
- Acceso SSH a servidor Debian 13
- Usuario con privilegios sudo en el servidor destino

---

## 🐳 Opción 1: Despliegue con Docker Compose

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Daniout/Taller_Docker_Compose.git
cd TALLER_DOCKER_COMPOSE
```

# Backend
BACKEND_PORT=8080
API_URL=http://localhost:8080

# Frontend
FRONTEND_PORT=80
VITE_APP_API_URL=http://localhost:3000
```

### Paso 3: Construir y Levantar los Servicios
```bash
# Construir las imágenes
docker-compose build

# Levantar todos los servicios en segundo plano
docker-compose up -d

# Ver los logs en tiempo real
docker-compose logs -f
```

### Paso 4: Verificar el Despliegue
```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Verificar la salud de los servicios
docker-compose exec backend curl http://localhost:8080/health
```

### Paso 5: Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Documentación API**: http://localhost:8080/docs (si tienes Swagger)

### Comandos Útiles Docker Compose
```bash
# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Ver logs de un servicio específico
docker-compose logs backend

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend bash

# Reconstruir un servicio específico
docker-compose build backend
docker-compose up -d backend
```

---

## 🤖 Opción 2: Despliegue Automatizado con Ansible

### Paso 1: Preparar el Entorno Ansible
```bash
# Instalar Ansible (Ubuntu/Debian)
sudo apt update
sudo apt install ansible

# Verificar instalación
ansible --version
```

### Paso 2: Configurar el Inventario
Edita el archivo `ansible-hostname-timezone/inventory.ini`:
```ini

<img width="531" height="132" alt="image" src="https://github.com/user-attachments/assets/ae2d7f43-a85a-4870-9ec5-ad58286f4acb" />
reemplazar por ip_maquina_virtual y usuario
```

### Paso 3: Ejecutar automatización con ansible

El comando debe ejecutarse situado en la carpeta `ansible-hostname-timezone`
ansible-playbook -i inventory.ini docker_auto.yml -v


### Paso 4: Verificar el Despliegue Remoto
```bash
# Conectarse al servidor
ssh deploy@<ip_maquina_virtual>

# Verificar servicios Docker
sudo docker-compose -f /opt/products-app/docker-compose.yml ps

# Ver logs
sudo docker-compose -f /opt/products-app/docker-compose.yml logs -f
```

### Comandos Útiles Ansible
```bash
# Verificar conectividad
ansible -i inventory.ini production_servers -m ping

# Ejecutar comandos ad-hoc
ansible -i inventory.ini production_servers -m shell -a "docker ps"

# Verificar syntax del playbook
ansible-playbook site.yml --syntax-check

# Listar hosts
ansible-inventory -i inventory.ini --list
```

---


**Error: Contenedor no puede conectar a la base de datos**
```bash
# Verificar red de Docker
docker network ls
docker network inspect taller_docker_compose_default

# Revisar logs de la base de datos
docker-compose logs db
```

