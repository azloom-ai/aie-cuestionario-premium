@echo off
color 0A
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           TEST LOCAL - VERIFICAR INTEGRACIÓN              ║
echo ║                                                            ║
echo ║  Este script verifica que:                               ║
echo ║  ✓ Claude API está funcionando                           ║
echo ║  ✓ Se puede generar un resumen                           ║
echo ║  ✓ El webhook de n8n está accesible                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar que estamos en la carpeta correcta
if not exist "test-local.js" (
    echo ❌ Error: No se encontró test-local.js
    echo Asegúrate de ejecutar este archivo desde la carpeta del proyecto
    pause
    exit /b 1
)

REM Verificar que Node está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version
echo.

REM Instalar dependencias si es necesario
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
    echo.
)

REM Buscar el API key en .env
if exist ".env" (
    echo ✅ Archivo .env encontrado
) else (
    echo ⚠️ No se encontró .env
    echo La API key debe estar en variables de entorno: CLAUDE_API_KEY
    echo.
)

echo.
echo 🚀 Ejecutando test...
echo.

REM Ejecutar el test
node test-local.js

if errorlevel 1 (
    echo.
    echo ❌ El test falló
    pause
    exit /b 1
)

echo.
echo ✅ ¡TEST COMPLETADO EXITOSAMENTE!
echo.
pause
