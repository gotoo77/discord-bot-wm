# Discord Bot Template — Games + Watermark (per user)

Template Node.js basé sur **discord.js v14**.

## Fonctionnalités

### 🖼️ Watermark (V0.1.0) — par utilisateur
- `/setlogo` : enregistre votre logo perso (stocké côté bot en `data/logos/<userId>.png`)
- `/getconfig` : affiche la config watermark active (public/privé)
- `/setopacity` : opacité du watermark (0.0 à 1.0)
- `/setscale` : échelle du logo (0.05 à 1.0)
- `/setmargin` : marge en pixels
- `/setposition` : position (`northwest`, `northeast`, `southwest`, `southeast`, `center`)
- `/setchannels` : liste d’IDs de salons autorisés
- Mode **auto** : si tu postes une image dans un salon autorisé, le bot renvoie une version watermarkée.

> Pour l’instant: **watermark par utilisateur** (chaque user a son propre logo).  
> On pourra ajouter un mode “logo global serveur” plus tard éventuellement.

### 🎵 Musique (plus tard)
Scaffold Lavalink présent mais **désactivé par défaut** (`ENABLE_LAVALINK=false`).

---

## Prérequis
- Node.js 20+ (ou 22)
- Un bot Discord (Application + Bot) + token
- Pour le watermark: le bot doit pouvoir lire les messages et joindre des fichiers

---

## Installation
```bash
npm install
cp .env.example .env
```

Renseigne dans `.env` :
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `GUILD_ID`
- `WATERMARK_CHANNEL_IDS` (ID du salon dédié watermark)
- `LOG_LEVEL=debug` (optionnel, pour logs détaillés)

Enregistrement des commandes slash (guild-only, instantané) :
```bash
npm run register
```

Lancer :
```bash
npm start
```

---

## Docker (recommandé pour déploiement)

### Prérequis
- Docker + Docker Compose (v2)

### 1) Préparer la config
```bash
cp .env.example .env
```
Renseigne les variables dans `.env` (DISCORD_TOKEN, etc.).

### 2) Construire et lancer
```bash
docker compose up -d --build
```

### 3) Enregistrer les commandes slash
À faire une seule fois (ou après changement de commandes) :
```bash
docker compose run --rm bot npm run register
```

### 4) Logs
```bash
docker compose logs -f
```

### Données persistées
Les logos sont stockés dans `data/logos/` et sont persistés via le volume `./data:/app/data`.

---

## Configuration Watermark

### Mode de fonctionnement (sélection des photos)
Discord n’offre pas une “sélection de fichiers” interactive comme un explorateur.  
La solution simple et robuste est de **déposer** les images à traiter dans un salon dédié (ou dans un thread sous ce salon).

- Crée un salon: `#watermark`
- Mets son ID dans `WATERMARK_CHANNEL_IDS`
- Les utilisateurs :
  1. font `/setlogo` une fois
  2. postent des images dans `#watermark`
  3. le bot répond avec les images watermarkées

Tu peux aussi créer des **threads** sous ce salon : ils sont acceptés si leur salon parent est dans `WATERMARK_CHANNEL_IDS`.

### Commandes slash (détails rapides)
Utilise ces commandes dans un serveur où le bot est présent :
- `/setlogo` : envoie une image en pièce jointe pour définir ton logo (une seule fois, remplaçable si tu relances la commande).
- `/getconfig` : affiche ta config actuelle (opacité, échelle, marge, position, salons autorisés).
- `/setopacity <0.0-1.0>` : règle la transparence du logo.
- `/setscale <0.05-1.0>` : ajuste la taille du logo.
- `/setmargin <pixels>` : distance en pixels entre le logo et les bords.
- `/setposition <northwest|northeast|southwest|southeast|center>` : place le logo.
- `/setchannels <ids>` : définit les salons autorisés (IDs séparés par des espaces ou des virgules).

Astuce : si un paramètre ne te convient pas, relance simplement la commande concernée pour le modifier.

Sortie `getconfig` (exemple) :
```text
enabled: true
mode: auto
channels: 1466872744313360425
opacity: 0.75
scale: 0.18
margin: 24
position: southwest
logo: set (12345 bytes)
```

### Formats gérés (actuellement)
✅ Entrée : `JPEG`, `PNG`, `WEBP`  
✅ Sortie : image watermarkée renvoyée sur Discord

Non gérés (actuellement) :
- ❌ `GIF` (animation) — ignoré volontairement
- ❌ `RAW` (photos appareil) — non supporté

---

## Permissions Discord requises

### OAuth2 Scopes (pour inviter le bot)
- `bot`
- `applications.commands`

### Bot Permissions (minimum recommandé)
- View Channels
- Send Messages
- Attach Files
- Read Message History (recommandé)
- Use Slash Commands
- Send Messages in Threads
- Create Public Threads (si tu veux créer/écrire dans des threads)

> Pour le mode auto watermark, le bot a besoin de voir les messages et leurs pièces jointes dans le salon ciblé.

### Intents
Le bot utilise :
- `Guilds`
- `GuildVoiceStates` (préparé pour musique plus tard)
- `GuildMessages` (pour watermark auto)

✅ **Message Content Intent** est requis pour recevoir correctement les events et pièces jointes.

---

## Dépannage rapide
- Commandes slash invisibles: relance `npm run register` et vérifie `GUILD_ID`
- Bot en ligne mais pas de watermark:
  - `ENABLE_WATERMARK=true`
  - `WATERMARK_CHANNEL_IDS` correct
  - tu as fait `/setlogo`
  - l’image est en JPG/PNG/WebP
  - le bot a bien accès au salon (et aux threads)
