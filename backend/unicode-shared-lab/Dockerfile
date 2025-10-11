# lab-image-template/Dockerfile.lab
FROM ubuntu:22.04
ARG TARGETARCH

# Install all tools needed for the multi-user system
RUN apt-get update && apt-get install -y \
  curl sudo gosu git nginx nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# Install code-server
RUN curl -fsSL "https://github.com/coder/code-server/releases/download/v4.23.0/code-server-4.23.0-linux-${TARGETARCH}.tar.gz" \
    | tar -xz -C /opt && \
    ln -s /opt/code-server-*/bin/code-server /usr/local/bin/code-server

# Copy all the new scripts for the internal logic
WORKDIR /opt/lab
COPY . .
RUN chmod +x ./entrypoint.lab.sh

# The main door to the "suite" will be port 80 (for the internal Nginx)
EXPOSE 80
ENTRYPOINT ["/opt/lab/entrypoint.lab.sh"]