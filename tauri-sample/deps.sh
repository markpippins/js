#!/usr/bin/env bash
set -e

# Update repositories
sudo apt update

# Install core build dependencies
sudo apt install -y \
  build-essential \
  curl \
  wget \
  git \
  cmake \
  pkg-config \
  libssl-dev \
  libgtk-3-dev \
  libwebkit2gtk-4.1-dev \
  libjavascriptcoregtk-4.1-dev \
  libappindicator3-dev \
  libsoup2.4-dev \
  libpango1.0-dev \
  libglib2.0-dev \
  libnss3-dev \
  libatk1.0-dev \
  libatk-bridge2.0-dev \
  ca-certificates

#   libgdk-pixbuf2.0-dev \

# Set PKG_CONFIG_PATH if necessary (examples, may need adjustment per system)
if ! grep -q javascriptcoregtk-4.1.pc <<< "$(pkg-config --list-all 2>/dev/null)"; then
  export PKG_CONFIG_PATH="/usr/lib/x86_64-linux-gnu/pkgconfig:/usr/lib/pkgconfig:/usr/share/pkgconfig"
fi

echo "All required Tauri dependencies installed."
