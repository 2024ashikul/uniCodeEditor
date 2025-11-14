# Start from the base code-server image
FROM codercom/code-server:latest

# Switch to root user to install packages
USER root

# Install Python 3, pip, and a build utility (required for some packages)
RUN apt-get update && \
    apt-get install -y python3 python3-pip build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install common Python packages for a development environment
# FIX: Use --break-system-packages to override PEP 668 protection
RUN pip3 install flask --break-system-packages jupyter numpy pandas matplotlib

# Switch back to the non-root 'coder' user
USER coder