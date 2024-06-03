#!/bin/bash

# if pull new code
if [ "${1}" = "pull" ]; then
    echo "Starting pull from master"

    git pull origin master

    # delete old process
    pm2 delete all

    pm2 cleardump

    pm2 save --force

    sleep 5s
    
    # run backend
    echo "Run nodejs server on port 9000" 

    cd api

    yarn

    pm2 start index.js --name api --watch=true

    sleep 5s

    # run web app
    echo "Run nextjs app on port 9000" 

    cd ../web-app

    yarn

    yarn build

    pm2 start "npm run start -- -p 3000" --name web --watch=true

    sleep 5s 

    pm2 cleardump

    pm2 save
fi

# if restart
if [ "${1}" = "restart" ]; then
    echo "Restart all"

    sleep 2s
    pm2 restart api --watch=true

    sleep 2s
    pm2 restart web --watch=true
fi

# if pull-be
if [ "${1}" = "pull-be" ]; then
    echo "Starting pull from master"

    git pull origin master

    # delete old process
    pm2 delete all

    pm2 cleardump

    pm2 save --force

    sleep 5s
    
    # run backend
    echo "Run nodejs server on port 9000" 

    cd api

    yarn

    pm2 start index.js --name api --watch=true

    sleep 5s
fi