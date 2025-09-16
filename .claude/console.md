[plugin:vite:import-analysis] Failed to resolve import "../../pages/MatchmakingDemo" from "src/components/gaming/GamePageWithSidebar.tsx". Does the file exist?
E:/Progetto/Progetti/APP/Skemino prova/client/src/components/gaming/GamePageWithSidebar.tsx:2:32
15 |    window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
16 |  }
17 |  import { MatchmakingDemo } from "../../pages/MatchmakingDemo";
   |                                   ^
18 |  import DashboardSidebar from "./DashboardSidebar";
19 |  const GamePageWithSidebar = () => {
    at TransformPluginContext._formatError (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
    at TransformPluginContext.error (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
    at normalizeUrl (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64306:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64438:39
    at async Promise.all (index 3)
    at async TransformPluginContext.transform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64365:7)
    at async PluginContainer.transform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
    at async loadAndTransform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
    at async viteTransformMiddleware (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.