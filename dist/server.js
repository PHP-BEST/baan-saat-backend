"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const sample_1 = __importDefault(require("./routes/sample"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const helmet_1 = __importDefault(require("helmet"));
const express_xss_sanitizer_1 = require("express-xss-sanitizer");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./configs/mongodb"));
dotenv_1.default.config();
(0, mongodb_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, express_xss_sanitizer_1.xss)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 100,
}));
app.use((0, hpp_1.default)());
app.use((0, cors_1.default)());
app.use('/samples', sample_1.default);
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project Baan Saat API',
            version: '1.0.0',
            description: 'API documentation for Project Baan Saat',
        },
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: 'Connection Successful!' });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Export the app for Vercel
exports.default = app;
// Only listen when running locally
if (require.main === module) {
    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`));
}
