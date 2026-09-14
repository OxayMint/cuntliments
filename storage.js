const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SEED_PATH = path.join(__dirname, 'data.json');
const DEFAULT_PATH = process.env.DATA_PATH || SEED_PATH;

let dataPath = DEFAULT_PATH;
let data = { everyday: [], suggested: [] };

function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function seedIfNeeded() {
    if (fs.existsSync(dataPath)) {
        return;
    }
    ensureDir(dataPath);
    if (fs.existsSync(SEED_PATH) && path.resolve(SEED_PATH) !== path.resolve(dataPath)) {
        fs.copyFileSync(SEED_PATH, dataPath);
        return;
    }
    data = { everyday: [], suggested: [] };
    save();
}

function load() {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    data = {
        everyday: Array.isArray(parsed.everyday) ? parsed.everyday : [],
        suggested: Array.isArray(parsed.suggested) ? parsed.suggested : [],
    };
}

function save() {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function newId() {
    return crypto.randomUUID();
}

module.exports = {
    async init(filePath) {
        dataPath = filePath || process.env.DATA_PATH || SEED_PATH;
        seedIfNeeded();
        load();
    },

    getCuntliment() {
        return new Promise((resolve, reject) => {
            if (!data.everyday.length) {
                reject(new Error('no compliments'));
                return;
            }
            const text = randomItem(data.everyday);
            resolve({ text, _id: text });
        });
    },

    getCuntlimentById(id) {
        const text = data.everyday.find((item) => item === id);
        return Promise.resolve(text ? { text, _id: id } : null);
    },

    addCuntliment(text) {
        data.everyday.push(text);
        save();
        return Promise.resolve({ acknowledged: true });
    },

    suggestCompliment(text, username) {
        const item = { _id: newId(), text, username };
        data.suggested.push(item);
        save();
        return Promise.resolve(item);
    },

    getSuggestedCuntliment() {
        return new Promise((resolve, reject) => {
            if (!data.suggested.length) {
                reject(new Error('no suggested'));
                return;
            }
            resolve(randomItem(data.suggested));
        });
    },

    getSuggestedCuntlimentById(id) {
        return Promise.resolve(data.suggested.find((item) => item._id === id) || null);
    },

    removeSuggested(id) {
        const before = data.suggested.length;
        data.suggested = data.suggested.filter((item) => item._id !== id);
        save();
        return Promise.resolve({ deletedCount: before - data.suggested.length });
    },

    moveSuggestedToEveryday(id) {
        const suggested = data.suggested.find((item) => item._id === id);
        if (!suggested) {
            return Promise.resolve();
        }
        data.everyday.push(suggested.text);
        data.suggested = data.suggested.filter((item) => item._id !== id);
        save();
        return Promise.resolve();
    },
};
