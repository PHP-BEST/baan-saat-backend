"use strict";
// For testing sample.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const sample_1 = __importDefault(require("../routes/sample"));
const mongoose_1 = __importDefault(require("mongoose"));
// Set up Express app for testing
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/samples', sample_1.default);
beforeAll(async () => {
    const mongo_uri = process.env.MONGO_URI_TEST || '';
    await mongoose_1.default.connect(mongo_uri);
});
afterAll(async () => {
    if (mongoose_1.default.connection.db) {
        await mongoose_1.default.connection.db.dropDatabase();
    }
    await mongoose_1.default.disconnect();
});
describe('Testing Sample API...', () => {
    let firstSampleId;
    const firstName = 'Test';
    const firstNewName = 'Test 1';
    const firstDescription = 'A test sample';
    const firstNewDescription = 'A test sample 1';
    it('Add the first sample', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/samples')
            .send({ name: firstName, description: firstDescription });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.name).toBe(firstName);
        expect(res.body.data.description).toBe(firstDescription);
        firstSampleId = res.body.data._id;
    });
    it('Add the second sample', async () => {
        const name = 'Test2';
        const description = 'A test sample2';
        const res = await (0, supertest_1.default)(app)
            .post('/samples')
            .send({ name: name, description: description });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.name).toBe(name);
        expect(res.body.data.description).toBe(description);
    });
    it('Get both samples', async () => {
        const res = await (0, supertest_1.default)(app).get('/samples');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(2);
    });
    it('Get the first sample by id', async () => {
        const res = await (0, supertest_1.default)(app).get(`/samples/${firstSampleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('_id', firstSampleId);
        expect(res.body.data.name).toBe(firstName);
        expect(res.body.data.description).toBe(firstDescription);
    });
    it('Update the first sample', async () => {
        const res = await (0, supertest_1.default)(app)
            .put(`/samples/${firstSampleId}`)
            .send({ name: firstNewName, description: firstNewDescription });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(firstNewName);
        expect(res.body.data.description).toBe(firstNewDescription);
    });
    it('Delete the first sample', async () => {
        const res = await (0, supertest_1.default)(app).delete(`/samples/${firstSampleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe(firstNewName);
        expect(res.body.data.description).toBe(firstNewDescription);
    });
});
