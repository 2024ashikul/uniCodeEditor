FROM codercom/code-server:latest

USER root

RUN apt-get update && apt-get install -y \
    nmap net-tools iproute2 traceroute tcpdump \
    wireshark tshark \
    python3 python3-pip \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir scapy requests netmiko

RUN code-server --install-extension ms-python.python

USER coder
