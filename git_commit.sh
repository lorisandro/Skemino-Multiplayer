#!/bin/bash
git add .
git commit -m "fix(websocket): resolve client-server connection issues

- Fix event name mismatch: matchmaking:start -> matchmaking:join
- Add automatic guest authentication for WebSocket connections
- Update client event listeners to match server events
- Implement robust token handling with guest session fallback
- Add comprehensive debugging documentation

Critical fixes:
- WebSocket connections now establish successfully
- Matchmaking button actually starts matchmaking process
- Automatic guest session creation when no auth token exists
- Proper authentication token passed to socket.io

Files modified:
- client/src/hooks/useSocket.ts: Fixed events and auth
- WEBSOCKET_DEBUG_SUMMARY.md: Added comprehensive debug guide"
git push origin HEAD