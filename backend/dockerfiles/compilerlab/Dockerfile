FROM codercom/code-server:latest

USER root

# Install compiler tools
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc g++ \
    clang llvm lldb \
    flex bison \
    make cmake \
    nasm \
    gdb \
    python3 python3-pip python3-venv \
    git curl wget && \
    rm -rf /var/lib/apt/lists/*

# Python compiler-related packages (with PEP668 override)
RUN pip3 install --no-cache-dir --break-system-packages \
    ply \
    antlr4-python3-runtime \
    lark-parser

# Install ANTLR tool (latest)
RUN curl -o /usr/local/lib/antlr-4.13.1-complete.jar \
    https://www.antlr.org/download/antlr-4.13.1-complete.jar && \
    echo '#!/bin/sh' > /usr/local/bin/antlr && \
    echo 'java -jar /usr/local/lib/antlr-4.13.1-complete.jar "$@"' >> /usr/local/bin/antlr && \
    chmod +x /usr/local/bin/antlr

# VS Code extensions
RUN code-server --install-extension ms-vscode.cpptools
RUN code-server --install-extension ms-python.python

USER coder
