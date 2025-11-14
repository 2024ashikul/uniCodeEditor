FROM codercom/code-server:latest

USER root

# Install essential security & networking tools
RUN apt-get update && apt-get install -y \
    nmap \
    wireshark tshark \
    tcpdump \
    hydra \
    netcat-openbsd \
    john \
    hashcat \
    nikto \
    sqlmap \
    net-tools \
    iproute2 \
    traceroute \
    python3 python3-pip \
    build-essential \
    git && \
    rm -rf /var/lib/apt/lists/*

# Python security packages
RUN pip3 install --no-cache-dir \
    scapy \
    cryptography \
    paramiko \
    requests \
    dnspython \
    pyfiglet \
    rich

# Node tools for pentesting
RUN apt-get update && apt-get install -y nodejs npm && \
    npm install -g wappalyzer wscat

# VS Code extensions
RUN code-server --install-extension ms-python.python
RUN code-server --install-extension zelldon.xss-defense
RUN code-server --install-extension shd101wyy.markdown-preview-enhanced

USER coder
