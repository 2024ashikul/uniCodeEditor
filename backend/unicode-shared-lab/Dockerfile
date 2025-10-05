# unicode-shared-lab/Dockerfile

FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV CODE_SERVER_VERSION=4.23.0

# This argument is automatically set by Docker to 'amd64' or 'arm64'
ARG TARGETARCH

RUN apt-get update && apt-get install -y \
  curl sudo gosu git nginx nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# Use the TARGETARCH variable to download the correct code-server binary
RUN curl -fsSL "https://github.com/coder/code-server/releases/download/v${CODE_SERVER_VERSION}/code-server-${CODE_SERVER_VERSION}-linux-${TARGETARCH}.tar.gz" \
  | tar -xz -C /opt && \
  # Use a wildcard to link the correct directory name automatically
  ln -s /opt/code-server-*/bin/code-server /usr/local/bin/code-server

WORKDIR /opt/lab
COPY . .
RUN chmod +x ./entrypoint.sh
RUN mkdir -p /var/log/lab

RUN groupadd -r students
RUN useradd -m -s /bin/bash teacher && usermod -aG sudo teacher
RUN mkdir -p /home/teacher/shared && chmod 777 /home/teacher/shared

EXPOSE 80 5000
ENTRYPOINT ["/opt/lab/entrypoint.sh"]