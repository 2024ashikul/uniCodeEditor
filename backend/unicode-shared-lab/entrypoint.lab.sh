#!/bin/bash
set -e

echo "Lab container started. Creating users: $USER_LIST"
# ... (rest of the user creation script) ...

echo "Users created. Starting lab service..."
# For testing, we start one code-server instance for the first user
USERNAME=$(echo $USER_LIST | cut -d ' ' -f 1 | cut -d ':' -f 1)
exec gosu $USERNAME code-server --bind-addr 0.0.0.0:8080 --auth none