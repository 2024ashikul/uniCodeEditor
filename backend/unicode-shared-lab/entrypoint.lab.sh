#!/bin/bash
set -e

echo "Running user and session setup..."
# Run the Node.js script in the foreground. It will create users,
# start code-servers, write the nginx.conf, and then exit.
node /opt/lab/session-manager.lab.js

echo "Setup complete. Starting main Nginx proxy..."
# Now that nginx.conf is guaranteed to be correct, start Nginx.
# 'exec' replaces the shell process with Nginx.
exec nginx -g "daemon off;"