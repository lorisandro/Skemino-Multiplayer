react-dom.development.js:29895 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
history.ts:494  Uncaught Error: You cannot render a <Router> inside another <Router>. You should never have more than one in your app.
    at invariant (history.ts:494:11)
    at Router (components.tsx:429:3)
    at renderWithHooks (react-dom.development.js:15486:18)
    at mountIndeterminateComponent (react-dom.development.js:20103:13)
    at beginWork (react-dom.development.js:21626:16)
    at HTMLUnknownElement.callCallback2 (react-dom.development.js:4164:14)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4213:16)
    at invokeGuardedCallback (react-dom.development.js:4277:31)
    at beginWork$1 (react-dom.development.js:27490:7)
    at performUnitOfWork (react-dom.development.js:26596:12)
AuthContext.tsx:119 🔐 RequireAuth check: Object
AuthContext.tsx:119 🔐 RequireAuth check: Object
history.ts:494  Uncaught Error: You cannot render a <Router> inside another <Router>. You should never have more than one in your app.
    at invariant (history.ts:494:11)
    at Router (components.tsx:429:3)
    at renderWithHooks (react-dom.development.js:15486:18)
    at mountIndeterminateComponent (react-dom.development.js:20103:13)
    at beginWork (react-dom.development.js:21626:16)
    at HTMLUnknownElement.callCallback2 (react-dom.development.js:4164:14)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4213:16)
    at invokeGuardedCallback (react-dom.development.js:4277:31)
    at beginWork$1 (react-dom.development.js:27490:7)
    at performUnitOfWork (react-dom.development.js:26596:12)
react-dom.development.js:18704  The above error occurred in the <Router> component:

    at Router (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:4501:15)
    at BrowserRouter (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:5247:5)
    at AppContent (http://localhost:3000/src/App.tsx?t=1758041101158:30:37)
    at AuthProvider (http://localhost:3000/src/contexts/AuthContext.tsx?t=1758040449361:21:32)
    at App
    at GamePage
    at RequireAuth (http://localhost:3000/src/contexts/AuthContext.tsx?t=1758040449361:110:3)
    at RenderedRoute (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:4088:5)
    at Routes (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:4558:5)
    at AuthProvider (http://localhost:3000/src/contexts/AuthContext.tsx?t=1758040449361:21:32)
    at DndProvider2 (http://localhost:3000/node_modules/.vite/deps/react-dnd.js?v=6006470b:1505:9)
    at Router (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:4501:15)
    at BrowserRouter (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=6006470b:5247:5)
    at Router
    at ErrorBoundary (http://localhost:3000/src/components/ErrorBoundary.tsx:7:5)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
logCapturedError @ react-dom.development.js:18704
ErrorBoundary.tsx:23  ErrorBoundary caught an error: Error: You cannot render a <Router> inside another <Router>. You should never have more than one in your app.
    at invariant (history.ts:494:11)
    at Router (components.tsx:429:3)
    at renderWithHooks (react-dom.development.js:15486:18)
    at mountIndeterminateComponent (react-dom.development.js:20103:13)
    at beginWork (react-dom.development.js:21626:16)
    at beginWork$1 (react-dom.development.js:27465:14)
    at performUnitOfWork (react-dom.development.js:26596:12)
    at workLoopSync (react-dom.development.js:26505:5)
    at renderRootSync (react-dom.development.js:26473:7)
    at recoverFromConcurrentError (react-dom.development.js:25889:20) Object
componentDidCatch @ ErrorBoundary.tsx:23
[NEW] Explain Console errors by using Copilot in Edge: click
         
         to explain an error. 
        Learn more
        Don't show again
// Testing fix for Router nesting issue
