const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');


const url = "mongodb://localhost:27017";

var db, mongoClient;
const dbName = 'cuntliments';
// Database Name


var collections = {
    everyday: null,
    suggested: null
};
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log(url);
    console.log(err);
    mongoClient = client;
    db = mongoClient.db(dbName);
    collections = {
        everyday: db.collection('everyday'),
        suggested: db.collection('suggested'),
        adminModes: db.collection('admin_modes')
    }
    collections.everyday.createIndex({ "text": "text" });
});





module.exports = {
    getCuntliment() {
        return new Promise((resolve, reject) => {
            var cursor = collections.everyday.aggregate([{ $sample: { size: 1 } }]);
            // console.log(cursor);
            cursor.next((err, res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject();
                }
            });


        });
    },
    getCuntlimentById(id) {
        return collections.everyday.findOne({ _id: new ObjectId(id) }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    },

    addCuntliment(text) {
        return new Promise((resolve, reject) => collections.everyday.insert({ text: text }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        }));
    },

    suggestCompliment(text, username) {
        return new Promise((resolve, reject) => collections.suggested.insert({ text: text, username: username }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        }));
    },

    getSuggestedCuntliment() {
        return new Promise((resolve, reject) => {
            var cursor = collections.everyday.aggregate([{ $sample: { size: 1 } }]);
            cursor.next((err, res) => {
                if (err) reject(err);
                else resolve(res);
            });


        });
    },
    getSuggestedCuntlimentById(id) {
        return collections.suggested.findOne({ _id: new ObjectId(id) }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    },

    removeSuggested(id) {
        return new Promise((resolve, reject) => collections.suggested.delete({ _id: new ObjectId(id) }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        }));
    },

    moveSuggestedToEveryday(id) {
        this.getSuggestedCuntlimentById(id).then(suggested => {
            this.addCuntliment(suggested.text);
            this.removeSuggested(suggested.id)
        });
    }
}