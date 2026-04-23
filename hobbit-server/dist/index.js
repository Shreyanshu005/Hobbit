"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const REQUIRED_ENV_VARS = ['GEMINI_API_KEY', 'FRONTEND_URL'];
for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
        console.error(`[startup] Missing required environment variable: ${key}`);
        process.exit(1);
    }
}
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 3000;
const app = (0, app_1.default)();
app.listen(PORT, () => {
    console.log(`[server] Running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`);
});
//# sourceMappingURL=index.js.map