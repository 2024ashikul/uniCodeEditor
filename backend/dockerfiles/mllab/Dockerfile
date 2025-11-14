FROM codercom/code-server:latest

USER root

# Install Python and required system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-dev \
    build-essential \
    git curl wget \
    libgl1 libglib2.0-0 \
    python3-opencv && \
    rm -rf /var/lib/apt/lists/*

# Python ML stack (with PEP 668 override)
RUN pip3 install --no-cache-dir --break-system-packages \
    numpy \
    scipy \
    pandas \
    scikit-learn \
    matplotlib \
    seaborn \
    jupyter \
    jupyterlab

# Install TensorFlow (CPU version)
RUN pip3 install --no-cache-dir --break-system-packages \
    tensorflow-cpu

# Install PyTorch (CPU wheels from official source)
RUN pip3 install --no-cache-dir --break-system-packages \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# VS Code extensions
RUN code-server --install-extension ms-python.python
RUN code-server --install-extension ms-toolsai.jupyter

USER coder
