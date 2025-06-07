#!/bin/bash
echo "💧 Instalando Fonte de Vida..."

# Criar atalho no launcher
cat > ~/.local/share/applications/fonte-vida.desktop << EOF
[Desktop Entry]
Name=Fonte de Vida
Icon=$(pwd)/goticula.png
Exec=google-chrome --app=file://$(pwd)/fonte-vida.html
Type=Application
Categories=Office;
EOF

chmod +x ~/.local/share/applications/fonte-vida.desktop
echo "✅ Instalado! Procure a gotícula 💧 no launcher"
