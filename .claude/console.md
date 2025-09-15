chunk-GKJBSOWT.js?v=c828683b:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
AuthDemo.tsx:174 Uncaught TypeError: Cannot read properties of undefined (reading 'totalGames')
    at DashboardView (AuthDemo.tsx:174:93)
    at renderWithHooks (chunk-GKJBSOWT.js?v=c828683b:11548:26)
    at mountIndeterminateComponent (chunk-GKJBSOWT.js?v=c828683b:14926:21)
    at beginWork (chunk-GKJBSOWT.js?v=c828683b:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-GKJBSOWT.js?v=c828683b:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-GKJBSOWT.js?v=c828683b:3699:24)
    at invokeGuardedCallback (chunk-GKJBSOWT.js?v=c828683b:3733:39)
    at beginWork$1 (chunk-GKJBSOWT.js?v=c828683b:19765:15)
    at performUnitOfWork (chunk-GKJBSOWT.js?v=c828683b:19198:20)
    at workLoopSync (chunk-GKJBSOWT.js?v=c828683b:19137:13)
AuthDemo.tsx:174 Uncaught TypeError: Cannot read properties of undefined (reading 'totalGames')
    at DashboardView (AuthDemo.tsx:174:93)
    at renderWithHooks (chunk-GKJBSOWT.js?v=c828683b:11548:26)
    at mountIndeterminateComponent (chunk-GKJBSOWT.js?v=c828683b:14926:21)
    at beginWork (chunk-GKJBSOWT.js?v=c828683b:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-GKJBSOWT.js?v=c828683b:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-GKJBSOWT.js?v=c828683b:3699:24)
    at invokeGuardedCallback (chunk-GKJBSOWT.js?v=c828683b:3733:39)
    at beginWork$1 (chunk-GKJBSOWT.js?v=c828683b:19765:15)
    at performUnitOfWork (chunk-GKJBSOWT.js?v=c828683b:19198:20)
    at workLoopSync (chunk-GKJBSOWT.js?v=c828683b:19137:13)
chunk-GKJBSOWT.js?v=c828683b:14032 The above error occurred in the <DashboardView> component:

    at DashboardView (http://localhost:3000/src/pages/AuthDemo.tsx?t=1757924587025:289:129)
    at AuthDemo (http://localhost:3000/src/pages/AuthDemo.tsx?t=1757924587025:25:41)
    at DndProvider2 (http://localhost:3000/node_modules/.vite/deps/react-dnd.js?v=c828683b:1505:9)
    at AuthProvider (http://localhost:3000/src/contexts/AuthContext.tsx?t=1757924214069:21:32)
    at App (http://localhost:3000/src/App.tsx?t=1757924587025:26:27)
    at GamePage
    at RequireAuth (http://localhost:3000/src/contexts/AuthContext.tsx?t=1757924214069:110:3)
    at RenderedRoute (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=c828683b:4088:5)
    at Routes (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=c828683b:4558:5)
    at AuthProvider (http://localhost:3000/src/contexts/AuthContext.tsx?t=1757924214069:21:32)
    at Router (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=c828683b:4501:15)
    at BrowserRouter (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=c828683b:5247:5)
    at Router
    at ErrorBoundary (http://localhost:3000/src/components/ErrorBoundary.tsx:7:5)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
logCapturedError @ chunk-GKJBSOWT.js?v=c828683b:14032
ErrorBoundary.tsx:23 ErrorBoundary caught an error: TypeError: Cannot read properties of undefined (reading 'totalGames')
    at DashboardView (AuthDemo.tsx:174:93)
    at renderWithHooks (chunk-GKJBSOWT.js?v=c828683b:11548:26)
    at mountIndeterminateComponent (chunk-GKJBSOWT.js?v=c828683b:14926:21)
    at beginWork (chunk-GKJBSOWT.js?v=c828683b:15914:22)
    at beginWork$1 (chunk-GKJBSOWT.js?v=c828683b:19753:22)
    at performUnitOfWork (chunk-GKJBSOWT.js?v=c828683b:19198:20)
    at workLoopSync (chunk-GKJBSOWT.js?v=c828683b:19137:13)
    at renderRootSync (chunk-GKJBSOWT.js?v=c828683b:19116:15)
    at recoverFromConcurrentError (chunk-GKJBSOWT.js?v=c828683b:18736:28)
    at performConcurrentWorkOnRoot (chunk-GKJBSOWT.js?v=c828683b:18684:30) Object
componentDidCatch @ ErrorBoundary.tsx:23
