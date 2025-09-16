#!/bin/bash

# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix(auth): resolve JWT authentication issues for WebSocket connections

- Fix token storage mismatch between useAuth ('skemino_auth_token') and useWebSocket ('auth_token')
- Update WebSocket client to use correct localStorage/sessionStorage keys
- Improve JWT signature validation error handling in SocketManager
- Add explicit JWT algorithm (HS256) and issued-at-time (iat) in token generation
- Enhanced error handling for authentication token failures
- Fix WebSocket URL port from 3001 to 3005 to match server configuration
- Add token update mechanism for WebSocket reconnection after login
- Prevent emergency guest fallback for legitimate JWT signature errors
- Add comprehensive debug logging for JWT token creation and verification
- Maintain consistent token key naming across all authentication components

This resolves the issue where registered users were getting 'invalid signature' errors
and falling back to emergency guest sessions instead of proper authentication."

# Push changes
git push origin main