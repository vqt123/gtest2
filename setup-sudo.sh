#!/bin/bash

echo "Setting up passwordless sudo for development commands..."
echo "This will allow Claude to run specific system commands without password prompts"
echo ""

# Create the sudoers file content
cat > /tmp/claude-dev-sudoers << 'EOF'
# Allow Claude development commands without password
vqt123 ALL=(ALL) NOPASSWD: /bin/systemctl stop redis-server
vqt123 ALL=(ALL) NOPASSWD: /bin/systemctl start redis-server
vqt123 ALL=(ALL) NOPASSWD: /bin/systemctl stop postgresql
vqt123 ALL=(ALL) NOPASSWD: /bin/systemctl start postgresql
vqt123 ALL=(ALL) NOPASSWD: /bin/kill
vqt123 ALL=(ALL) NOPASSWD: /usr/bin/kill
EOF

echo "Created sudoers configuration. Contents:"
echo "----------------------------------------"
cat /tmp/claude-dev-sudoers
echo "----------------------------------------"
echo ""
echo "To install this configuration, run:"
echo "sudo cp /tmp/claude-dev-sudoers /etc/sudoers.d/claude-dev"
echo "sudo chmod 440 /etc/sudoers.d/claude-dev"
echo ""
echo "To test it works, try:"
echo "sudo systemctl status redis-server"
echo ""
echo "To remove later (if needed):"
echo "sudo rm /etc/sudoers.d/claude-dev"