const app = require('../app');
const request = require('supertest');

module.exports = request(app);