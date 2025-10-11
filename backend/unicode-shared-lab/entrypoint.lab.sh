#!/bin/bash
set -e

echo "Lab container started. Creating users from list: '$USER_LIST'"
groupadd -r students &> /dev/null || true

for user_role_pair in $USER_LIST; do
    RAW_USERNAME=$(echo $user_role_pair | cut -d ':' -f 1)
    ROLE=$(echo $user_role_pair | cut -d ':' -f 2)
    USERNAME=$(echo "$RAW_USERNAME" | tr '[:upper:]' '[:lower:]')

    echo "Creating user: '$USERNAME' with role: '$ROLE'"
    useradd -m -s /bin/bash "$USERNAME"

    # --- BUG FIX IS HERE ---
    # Correctly check for 'admin' role, not 'teacher'
    if [ "$ROLE" == "admin" ]; then
        echo "  -> Assigning admin (sudo) permissions."
        usermod -aG sudo "$USERNAME"
    else
        echo "  -> Assigning student permissions."
        usermod -aG students "$USERNAME"
    fi
done

echo "Users created. Starting lab service..."
FIRST_USER=$(echo $USER_LIST | cut -d ' ' -f 1 | cut -d ':' -f 1 | tr '[:upper:]' '[:lower:]')
exec gosu "$FIRST_USER" code-server --bind-addr 0.0.0.0:8080 --auth none