#!/bin/bash

PATH=/home/dev/.nvm/versions/node/v14.17.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
NVM_BIN=/home/dev/.nvm/versions/node/v14.17.0/bin
NVM_INC=/home/dev/.nvm/versions/node/v14.17.0/include/node
NVM_DIR=/home/dev/.nvm

# Run ONLY from Anubis (Tastiest VULTR VPS) or by using `yarn redeploy`,
RED='\033[0;31m';
NC='\033[0m';
echo -e "${RED}NOTE: This will wipe all in-memory data. Be careful about when you redeploy.${NC}\n";

cd $HOME/tastiest-backend;

# Improve this -- it's a bit sloppy if Node version changes.
pm2=/home/dev/.nvm/versions/node/v14.17.0/bin/pm2;
yarn=/home/dev/.nvm/versions/node/v14.17.0/bin/yarn;

# Get changes.
# Ensure that no changes are made on the server, but only pulled.
# ref. https://www.freecodecamp.org/news/git-pull-force-how-to-overwrite-local-changes-with-git/
git fetch;
git reset --hard origin/master;

# Get new files
$yarn install -s --force;

# Attempt to build.
# Only restart current running process if build succeeds
$yarn build && $pm2 restart tastiest-backend;
echo "Done!";

