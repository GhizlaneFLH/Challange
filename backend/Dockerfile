# Utiliser une image Python légère
FROM python:3.10-slim

# Éviter que Python ne génère des fichiers .pyc et forcer l'affichage des logs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires (pour sentence-transformers et pypdf)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier des dépendances
COPY requirements.txt .

# Installer les bibliothèques Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source
COPY . .

# Créer les dossiers pour les données si ils n'existent pas
RUN mkdir -p data vector_db

# Exposer le port de FastAPI
EXPOSE 8000

# Commande par défaut (sera surchargée par docker-compose ou docker.sh)
CMD ["python", "main.py"]