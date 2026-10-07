@echo off
REM ---------------------------------------------------------------------------
REM  Compila Tailwind a tailwind.build.css
REM
REM  IMPORTANTE: apccore.site se publica directo desde la rama main, sin CI.
REM  Si agregas o cambias clases de Tailwind en index.html y NO ejecutas esto,
REM  los estilos faltan en produccion.
REM ---------------------------------------------------------------------------
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Instalando dependencias...
  call npm install || goto :error
)

echo Compilando Tailwind...
call npx @tailwindcss/cli -i tailwind.input.css -o tailwind.build.css --minify || goto :error

echo.
echo Listo. tailwind.build.css actualizado.
echo Recuerda hacer commit del CSS compilado.
endlocal
exit /b 0

:error
echo.
echo ERROR: la compilacion fallo.
echo Si estas sobre una ruta UNC (\\servidor\carpeta) npm puede fallar con
echo "Maximum call stack size exceeded". Ejecuta esto desde una unidad local mapeada.
exit /b 1