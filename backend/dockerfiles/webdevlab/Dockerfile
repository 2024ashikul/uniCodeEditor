FROM codercom/code-server:latest

USER root

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-dev \
    nodejs npm git && \
    rm -rf /var/lib/apt/lists/*

# Update npm & install common frameworks
RUN npm install -g npm vite create-react-app nodemon http-server

# Backend frameworks
RUN pip3 install --no-cache-dir \
    flask django fastapi uvicorn[standard]

# VS Code extensions
RUN code-server --install-extension ms-python.python
RUN code-server --install-extension ritwickdey.LiveServer
RUN code-server --install-extension esbenp.prettier-vscode

USER coder
