#!/bin/bash
set -e

# Ensure the root user owns the /home volume on startup
chown root:root /home

# Start the session manager in the background
node /opt/lab/session-manager.js &

# Wait for it to start
sleep 1

# Start Nginx in the foreground
nginx -g "daemon off;"