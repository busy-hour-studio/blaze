#!/bin/bash

if [ -e ./results/results.node.txt ]
then
  rm ./results/results.node.txt
fi

echo "[Express]" >> ./results/results.node.txt
./node_modules/tsx/dist/cli.mjs express/index.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3000/ --print result >> ./results/results.node.txt
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
sleep 5
echo "" >> ./results/results.node.txt

echo "[Blaze]" >> ./results/results.node.txt
./node_modules/tsx/dist/cli.mjs blaze/index.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3000/ --print result >> ./results/results.node.txt
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
sleep 5
echo "" >> ./results/results.node.txt

echo "[Hono]" >> ./results/results.node.txt
./node_modules/tsx/dist/cli.mjs hono/index.ts & sleep 5
./bombardier -d 10s --fasthttp http://localhost:3000/ --print result >> ./results/results.node.txt
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
sleep 5
