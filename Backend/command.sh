#!/usr/bin/bash

echo "[+] REINICIAMOS LAS MIGRACIONES"
npx prisma migrate reset 1>/dev/null 2>/dev/null

echo "[+] EJECUTAMOS LA MIGRACION"
npx prisma migrate dev --name init2 1>/dev/null 2>/dev/null || echo "NO HAY MIGRACIONES"

sleep 1

echo "[+] EJECUTAMOS MIGRACION DE EXISTENTES"
npx prisma deploy 1>/dev/null 2>/dev/null || echo "NO HAY MIGRACIONES PENDIENTES"

sleep 1

echo "[+] INICIAMOS EL SERVIDOR"
npm start