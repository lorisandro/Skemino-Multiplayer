login:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
login:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
login:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
login:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
login:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
authService.ts:73 Errore durante il login: TypeError: Failed to fetch
    at _$initInterceptor.s.fetch (chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/libs/requests.js:1:3725)
    at chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/executors/traffic.js:1:1473
    at new Promise (<anonymous>)
    at fetch (chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/executors/traffic.js:1:1450)
    at Object.login (src/services/authService.ts:5:30)
    at src/hooks/useAuth.ts:42:42
    at handleSubmit (src/pages/LoginPage.tsx:38:30)
    at HTMLUnknownElement.callCallback2 (node_modules/.vite/deps/chunk-GKJBSOWT.js?v=6006470b:3674:22)
    at Object.invokeGuardedCallbackDev (node_modules/.vite/deps/chunk-GKJBSOWT.js?v=6006470b:3699:24)
    at invokeGuardedCallback (node_modules/.vite/deps/chunk-GKJBSOWT.js?v=6006470b:3733:39)
overrideMethod @ hook.js:608
login @ authService.ts:73
Destinazione navigazione: http://localhost:3000/login
