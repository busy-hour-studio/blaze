#!/bin/bash

if [ -e ./results/results.bun.txt ]
then
  rm ./results/results.bun.txt
fi

echo "[Express]" >> ./results/results.bun.txt
npx bun ../express/index.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3002/ --print result >> ./results/results.bun.txt
kill -9 $(lsof -t -i:3002 -sTCP:LISTEN)
sleep 5
echo "" >> ./results/results.bun.txt

echo "[Blaze]" >> ./results/results.bun.txt
npx bun ../blaze/app.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3000/ --print result >> ./results/results.bun.txt
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
sleep 5
echo "" >> ./results/results.bun.txt

echo "[Hono]" >> ./results/results.bun.txt
npx bun ../hono/app.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3001/ --print result >> ./results/results.bun.txt
kill -9 $(lsof -t -i:3001 -sTCP:LISTEN)
sleep 5
