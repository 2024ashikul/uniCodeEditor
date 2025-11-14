FROM codercom/code-server:latest

USER root

RUN apt-get update && apt-get install -y \
    build-essential gcc g++ make gdb \
    qemu-system-x86 \
    qemu-utils \
    nasm \
    binutils \
    libc6-dev \
    python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir psutil

# Extensions
RUN code-server --install-extension ms-vscode.cpptools

USER coder
