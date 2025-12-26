# Étape 1 : Construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2 : Exécution
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires de l'étape builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port de Next.js
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]