[plugin:vite:css] [postcss] ENOENT: no such file or directory, open 'E:\Progetto\Progetti\APP\styles\board.css'
    at async open (node:internal/fs/promises:642:25)
    at async Object.readFile (node:internal/fs/promises:1279:14)
    at async Object.load (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:36835:25)
    at async loadImportContent (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-YkMKzX4u.js:844:19)
    at async Promise.all (index 0)
    at async resolveImportId (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-YkMKzX4u.js:800:27)
    at async parseStyles$1 (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-YkMKzX4u.js:708:5)
    at async Object.Once (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-YkMKzX4u.js:965:22)
    at async LazyResult.runAsync (E:\Progetto\Progetti\APP\Skemino prova\client\node_modules\postcss\lib\lazy-result.js:293:11)
    at async compileCSS (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:36898:21)
    at async TransformPluginContext.transform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:36171:11)
    at async PluginContainer.transform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
    at async loadAndTransform (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
    at async viteTransformMiddleware (file:///E:/Progetto/Progetti/APP/Skemino%20prova/client/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.