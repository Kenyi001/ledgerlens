# Subir LedgerLens a GitHub

El commit inicial ya está creado localmente. Sigue estos pasos:

## 1. Crear el repositorio en GitHub

1. Ve a **https://github.com/new**
2. Nombre: `ledgerlens` (o el que prefieras)
3. Descripción: `LedgerLens - Analizador financiero on-chain para billeteras Avalanche. Aleph Hackathon 2026.`
4. Elige ** público**
5. **No** marques "Add a README" (ya existe en el proyecto)
6. Clic en **Create repository**

## 2. Conectar y subir

En PowerShell o Git Bash, desde la carpeta del proyecto:

```powershell
cd c:\Users\daxke\Desktop\Proyectos\ledgerlens-backend

# Sustituye TU_USUARIO por tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/ledgerlens.git
git push -u origin main
```

Si te pide usuario/contraseña: usa tu usuario de GitHub y como contraseña un **Personal Access Token** (no la contraseña de la cuenta).
