FROM codercom/code-server:latest

USER root

# Update system and install base networking tools
RUN apt-get update && apt-get install -y \
    nmap \
    wireshark tshark \
    tcpdump \
    netcat-openbsd \
    net-tools \
    iproute2 \
    traceroute \
    python3 python3-pip \
    build-essential \
    git curl wget && \
    rm -rf /var/lib/apt/lists/*

# ----------------------------
# Install tools NOT available in Debian repo
# ----------------------------

# Install Hydra (source build)
RUN apt-get update && apt-get install -y libssl-dev libssh-dev libidn11-dev libpcre3-dev libgtk2.0-dev libmysqlclient-dev && \
    cd /opt && git clone https://github.com/vanhauser-thc/thc-hydra.git && \
    cd thc-hydra && ./configure && make && make install

# Install John The Ripper (community edition)
RUN cd /opt && git clone https://github.com/openwall/john.git && \
    cd john/src && ./configure && make -s clean && make -sj4

# Install Nikto
RUN cd /opt && git clone https://github.com/sullo/nikto.git && \
    ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto

# Install SQLMap
RUN git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git /opt/sqlmap && \
    ln -s /opt/sqlmap/sqlmap.py /usr/local/bin/sqlmap

# Install Hashcat (from GitHub)
RUN cd /opt && wget https://hashcat.net/files/hashcat-6.2.6.tar.gz && \
    tar -xzf hashcat-6.2.6.tar.gz && \
    cd hashcat-6.2.6 && make install

# ----------------------------
# Python Security Libraries
# ----------------------------
RUN pip3 install --no-cache-dir scapy cryptography requests paramiko dnspython rich

# ----------------------------
# VS Code extensions
# ----------------------------
RUN code-server --install-extension ms-python.python
RUN code-server --install-extension shd101wyy.markdown-preview-enhanced

USER coder
