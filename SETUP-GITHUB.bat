@echo off
REM Setup GitHub Repository for AIE Cuestionario
REM Este script crea el repo y sube el código

echo.
echo ========================================
echo  AIE Cuestionario - GitHub Setup
echo ========================================
echo.

REM Preguntar al usuario por su usuario de GitHub
set /p GITHUB_USER="Ingresa tu usuario de GitHub: "

REM Navegar a la carpeta del proyecto
cd /d "%~dp0"

echo.
echo Configurando Git...
git config user.name "%GITHUB_USER%"
git config user.email "hello@azloom.tech"

echo.
echo Agregando remote a GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/aie-cuestionario-premium.git

echo.
echo Haciendo push a GitHub...
echo Nota: Si pide credenciales, usa tu token de GitHub
git push -u origin master

echo.
echo ========================================
echo  ✓ GitHub Setup Completado!
echo ========================================
echo.
echo URL de tu repo:
echo https://github.com/%GITHUB_USER%/aie-cuestionario-premium
echo.
echo Siguiente paso:
echo 1. Ve a https://vercel.com/new
echo 2. Importa tu repo
echo 3. Agrega las variables
echo 4. Deploy!
echo.
pause
