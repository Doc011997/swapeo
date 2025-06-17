# 🚀 Guide de Déploiement Netlify - Backend Swapeo

## ✅ Configuration Actuelle

Le backend est maintenant configuré pour fonctionner avec Netlify Functions :

- **Structure serverless** : `netlify/functions/api.js`
- **Configuration** : `netlify.toml`
- **Dépendance** : `serverless-http` ajoutée

## 🔧 Étapes de Redéploiement

### 1. Dans l'interface Netlify

1. Allez sur votre projet : `coruscating-griffin-58551d.netlify.app`
2. Cliquez sur **"Deploys"**
3. Cliquez sur **"Trigger deploy"** > **"Clear cache and deploy site"**

### 2. Ou via drag & drop

1. Zippez le dossier `backend/` complet
2. Déposez le zip sur Netlify
3. Attendez le déploiement

## 🧪 Test de l'API

Une fois déployé, testez ces URLs :

```bash
# Page d'accueil avec documentation
https://coruscating-griffin-58551d.netlify.app/

# Health check
https://coruscating-griffin-58551d.netlify.app/health

# Test de connexion
curl -X POST https://coruscating-griffin-58551d.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

## 🔍 Debug si Problème

### Vérifier les logs de déploiement :

1. Netlify Dashboard > Deploys > Cliquez sur le deploy
2. Regardez les logs de build

### Erreurs communes :

- **"Module not found"** : Vérifiez que `serverless-http` est dans package.json
- **"Function timeout"** : Augmentez le timeout dans netlify.toml
- **"CORS errors"** : Vérifiez la configuration CORS dans api.js

## 🎯 Après le Déploiement

1. **Testez l'API** avec les URLs ci-dessus
2. **Connectez le frontend** en mettant à jour la variable d'environnement Builder.io :
   ```
   VITE_API_URL=https://coruscating-griffin-58551d.netlify.app
   ```

## 📱 Comptes de Test

- **john@example.com** / password123 (emprunteur)
- **sarah@example.com** / password123 (financeur)

## 🔗 URLs Importantes

- **Site principal** : https://coruscating-griffin-58551d.netlify.app
- **Documentation API** : https://coruscating-griffin-58551d.netlify.app/
- **Health check** : https://coruscating-griffin-58551d.netlify.app/health
- **Dashboard Netlify** : https://app.netlify.com/projects/coruscating-griffin-58551d
