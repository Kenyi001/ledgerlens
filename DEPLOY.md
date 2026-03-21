# Guía de despliegue LedgerLens → GitHub → Vercel

## Paso 1: Obtener API Keys

### GLACIER_API_KEY (Avalanche)
1. Ir a **https://app.avacloud.io/**
2. Crear cuenta o iniciar sesión
3. En el dashboard → **API Keys** o **Developer**
4. Crear nueva API key y copiarla

### OPENAI_API_KEY
1. Ir a **https://platform.openai.com/api-keys**
2. Crear API key (formato `sk-...`)
3. Copiarla

---

## Paso 2: Subir a GitHub

Abre PowerShell o Git Bash en la carpeta del proyecto:

```bash
cd c:\Users\daxke\Desktop\Proyectos\ledgerlens-backend

git init
git add .
git commit -m "feat: LedgerLens MVP - Aleph Hackathon"

git branch -M main
git remote add origin https://github.com/TU_USUARIO/ledgerlens.git
git push -u origin main
```

**Antes de push:** crea un repo vacío en GitHub (https://github.com/new) llamado `ledgerlens` (o el nombre que prefieras) y sustituye `TU_USUARIO` por tu usuario.

---

## Paso 3: Deploy en Vercel

1. Ir a **https://vercel.com** e iniciar sesión
2. **Add New Project** → Importar tu repo de GitHub
3. Configurar (Vercel suele detectar esto automáticamente):
   - **Framework Preset:** Other
   - **Build Command:** `cd ledgerlens-front && npm install && npm run build`
   - **Output Directory:** `ledgerlens-front/dist`
   - **Install Command:** `npm install`

4. **Environment Variables** (Settings → Environment Variables):
   | Variable          | Value                    |
   |-------------------|--------------------------|
   | `GLACIER_API_KEY` | (tu key de AvaCloud)     |
   | `OPENAI_API_KEY`  | (tu key de OpenAI)       |
   | `AVAX_USD_PRICE`  | `35` (opcional)          |

5. **Deploy**

Tu app quedará en `https://ledgerlens-xxx.vercel.app`.
