#!/bin/bash
# Run ONLY from Anubis (Tastiest VULTR VPS) or by using `yarn redeploy`,
RED='\033[0;31m';
NC='\033[0m';
echo -e "${RED}NOTE: This will wipe all in-memory data. Be careful about when you redeploy.${NC}\n";

# Stop current running process.
$(which pm2) stop tastiest-backend;

# Get changes.
# Ensure that no changes are made on the server, but only pulled.
# ref. https://www.freecodecamp.org/news/git-pull-force-how-to-overwrite-local-changes-with-git/
git fetch;

# Get new files
rm -rf node_modules;
$(which yarn) install;

# Attempt to build.

$(which yarn) build && $(which pm2) start tastiest-backend;

echo "Done! $build_success";