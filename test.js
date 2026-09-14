const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const storage = require('./storage');

async function run() {
    const source = path.join(__dirname, 'data.json');
    const tempFile = path.join(os.tmpdir(), `cuntliments-test-${Date.now()}.json`);
    fs.copyFileSync(source, tempFile);

    await storage.init(tempFile);

    const catalog = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
    assert.strictEqual(catalog.everyday.length, 47, 'expected 47 seeded answers');

    const seen = new Set();
    for (let i = 0; i < 40; i++) {
        const result = await storage.getCuntliment();
        assert.ok(catalog.everyday.includes(result.text), `unexpected answer: ${result.text}`);
        seen.add(result.text);
    }
    assert.ok(seen.size > 1, 'random answers should not always be the same');

    await storage.suggestCompliment('тестовый комплимент', 'tester');
    const suggested = await storage.getSuggestedCuntliment();
    assert.strictEqual(suggested.text, 'тестовый комплимент');
    assert.ok(suggested._id);

    await storage.moveSuggestedToEveryday(suggested._id);
    const afterPromote = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
    assert.ok(afterPromote.everyday.includes('тестовый комплимент'));
    assert.strictEqual(afterPromote.suggested.length, 0);

    await storage.suggestCompliment('на удаление', 'tester');
    const toRemove = await storage.getSuggestedCuntliment();
    await storage.removeSuggested(toRemove._id);
    await assert.rejects(() => storage.getSuggestedCuntliment(), /no suggested/);

    fs.unlinkSync(tempFile);

    const seedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cuntliments-seed-'));
    const seededPath = path.join(seedDir, 'nested', 'data.json');
    await storage.init(seededPath);
    const seeded = JSON.parse(fs.readFileSync(seededPath, 'utf8'));
    assert.strictEqual(seeded.everyday.length, 47, 'missing data.json should be seeded from the bundled file');
    fs.rmSync(seedDir, { recursive: true, force: true });

    console.log('ok');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
