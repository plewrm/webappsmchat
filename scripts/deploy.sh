#!/bin/bash

# for non interactive shell
HOME=/home/ubuntu
. $HOME/.bashrc

# Set NVM_DIR and initialize NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Add Node.js binary directory to PATH
export PATH="$HOME/.nvm/versions/node/v20.5.0/bin:$PATH"

set -x

# change working directory to wherever this script is
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

# check node version
node --version

# pull
git pull

# install dependencies
yarn

# build
yarn build

# restart on pm2
pm2 restart 0
