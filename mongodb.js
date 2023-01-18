const MongoClient = require('mongodb').MongoClient;


const url = "mongodb://localhost:27017";

var db, mongoClient;
const dbName = 'cuntliments';
// Database Name


var collections = {
    everyday: null
};
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log(url);
    console.log(err);
    mongoClient = client;
    db = mongoClient.db(dbName);
    collections = {
        everyday: db.collection('everyday')
    }
    collections.everyday.createIndex({ "text": "text" });
});





module.exports = {
    getCuntliment() {
        return new Promise((resolve, reject) => {
            var cursor = collections.everyday.aggregate([{ $sample: { size: 1 } }]);
            // console.log(cursor);
            cursor.next(function (err, doc) {
                if (doc) {
                    resolve(doc);
                } else {
                    reject();
                }
            });


        });
    },

    addCuntliment(text) {
        return new Promise((resolve, reject) => collections.everyday.insert({ text: text }, (err, res) => {
            if (err) {
                reject(err);
            }

            resolve(res);
        }));
    }

}
// updateDiscography(discog) {
//     /*
//     discog:
//         author:
//             albums:
//                 tracks:
//     */
//     var promises = [];

//     discog.tracks.forEach((track) => {
//         track._id = track.id;
//         promises.push(this.addTrack(track));
//     });
//     discog.albums.forEach((album) => {
//         album._id = album.id;
//         promises.push(this.addAlbum(album));
//     });
//     var authorAlbums = {
//         id: discog.author.id,
//         albums: discog.albumsShort
//     };
//     promises.push(this.addAuthorAlbums(authorAlbums));
//     discog.author._id = discog.author.id;
//     author = Object.assign({}, discog.author);
//     // author.albums = discog.albumsShort;
//     promises.push(this.addAuthor(author));
//     return Promise.all(promises).finally(() => {
//         return 'ok';
//     }).catch(err => { console.log(err); return null });
// },

// // importAuthorToDB(author) {
// //     var promises = [];

// //     discog.tracks.forEach((track) => {
// //         track._id = track.id;
// //         promises.push(this.addTrack(track));
// //     });
// //     discog.albums.forEach((album) => {
// //         album._id = album.id;
// //         promises.push(this.addAlbum(album));
// //     });
// //     var authorAlbums = {
// //         id: discog.author.id,
// //         albums: discog.albumsShort
// //     };
// //     promises.push(this.addAuthorAlbums(authorAlbums));
// //     discog.author._id = discog.author.id;
// //     author = Object.assign({}, discog.author);
// //     promises.push(this.addAuthor(author));
// //     return Promise.all(promises).finally(() => {
// //         return 'ok';
// //     }).catch(err => { console.log(err); return null });
// // },

// getAuthor(authorId) {
//     return collections.authors.findOne({ _id: new ObjectId(authorId) }, (err, res) => {
//         if (err) throw err;
//         return res;
//     });
// },

// getAlbum(albumId) {
//     return collections.albums.findOne({ _id: new ObjectId(albumId) }, (err, res) => {
//         if (err) throw err;
//         return res;
//     });
// },

// getTrack(trackId) {
//     return collections.tracks.findOne({ _id: new ObjectId(trackId) }, (err, res) => {
//         if (err) throw err;
//         return res;
//     });
// },

// addAuthor(author) {
//     return new Promise((resolve, reject) => collections.authors.updateOne({ _id: author.id }, { $set: author }, { 'upsert': true }, (err, res) => {
//         if (err) reject(err);
//         resolve(res);
//     }));
// },
// addAlbum(album) {
//     return new Promise((resolve, reject) => collections.albums.updateOne({ _id: album.id }, { $set: album }, { 'upsert': true }, (err, res) => {
//         if (err) reject(err);
//         resolve(res);
//     }));
// },

// addAuthorAlbums(authorAlbums) {
//     return new Promise((resolve, reject) => collections.authorAlbums.updateOne({ _id: authorAlbums.id }, { $set: authorAlbums }, { 'upsert': true }, (err, res) => {
//         if (err) reject(err);
//         resolve(res);
//     }));
// },
// addTrack(track) {
//     return new Promise((resolve, reject) => collections.tracks.updateOne({ _id: track.id }, { $set: track }, { 'upsert': true }, (err, res) => {
//         if (err) {
//             console.log('error on ' + track);
//             reject(err);
//         }

//         resolve(res);
//     }));
// },
// setTrackFile(trackId, file) {
//     return new Promise((resolve, reject) => collections.tracks.updateOne({ _id: trackId }, { $set: { 'file': file } }, { 'upsert': true }, (err, res) => {
//         if (err) {
//             console.log('error on ' + track);
//             reject(err);
//         }

//         resolve(res);
//     }));
// },


// addLink(link) {
//     return new Promise((resolve, reject) => {
//         collections.links.updateOne({ hash: link.hash, artist: link.artist }, {
//             $set: {
//                 hash: link.hash,
//                 artist: link.artist,
//                 user: link.user,
//                 loaded: false
//             }
//         }, { 'upsert': true }, (err, res) => {
//             if (err) resolve(err);
//             resolve(res);
//         })

//     });
// },
// completeLink(torrent) {
//     return collections.links.updateOne({ torrent: torrent }, {
//         $set: {
//             loaded: true
//         }
//     }, (err, res) => {
//         if (err) throw err;
//         return res;
//     })
// },

// searchAuthors(author) {
//     return new Promise((resolve, reject) => {
//         collections.authors.find({ $text: { $search: author } }).toArray(function (err, result) {
//             if (err) resolve([]);
//             resolve(result);
//         });
//     });
// },

// searchTracks(track) {
//     return new Promise((resolve, reject) => {
//         collections.tracks.find({ $text: { $search: track } }).toArray(function (err, result) {
//             if (err) resolve([]);
//             resolve(result);
//         });
//     });
// },



// searchAlbum(album) {
//     return new Promise((resolve, reject) => {
//         return collections.albums.find({ $text: { $search: album } }).toArray(function (err, result) {
//             if (err) resolve([]);
//             resolve(result);
//         });
//     });
// },

// findSearchCache(searchString) {
//     return new Promise((resolve, reject) => {
//         return collections.searchCache.findOne({ $text: { $search: searchString.toLowerCase() } }, (err, res) => {
//             if (err) resolve(null);
//             resolve(res.length == 0 ? null : res);
//         });
//     });
// },

// addSearchCache(searchString, searchResults) {
//     return collections.searchCache.updateOne({ "_id": searchString.toLowerCase() }, { "search_results": searchResults, "last_used": new Date() }, { upsert: true });
// },
// getReel() {
//     return new Promise((resolve, reject) => {
//         return collections.yt_tracks.find({}).sort({ 'last_used': -1 }).limit(10).toArray(function (err, result) {
//             if (err) resolve([]);
//             resolve(result);
//         });
//     });
// },
// addYTTrack(track) {
//     return new Promise((resolve, reject) => {
//         track.last_used = new Date();
//         track.created = new Date();
//         track.seacrh_term = track.title.toLowerCase();
//         return collections.yt_tracks.insertOne(track, { upsert: true }, (err, res) => {
//             if (err) reject(err);
//             resolve(res);
//         });
//     });
// },
// updateYTTrack(id, update) {
//     console.log("updating yt track " + id + ", " + JSON.stringify(update));
//     return new Promise((resolve, reject) => {
//         collections.yt_tracks.updateOne({ '_id': id }, { $set: update }, (err, result) => {
//             if (err) reject(err);

//             resolve(result);
//         });
//     });
// },
// getYTTrack(id) {
//     return new Promise((resolve, reject) => {
//         collections.yt_tracks.findOne({ '_id': id }, (err, result) => {
//             if (err) reject(err);

//             resolve(result);
//         });
//     });
// },
// searchYTTracks(searchTerm) {
//     return new Promise((resolve, reject) => {
//         // 
//         collections.yt_tracks.find({ seacrh_term: { $regex: `.*${searchTerm.toLowerCase()}.*` } }).toArray((err, result) => {
//             if (err) reject(err);

//             resolve(result);
//         });
//     });

// },
// createTelegramUser(id) {
//     return new Promise((resolve, reject) => {
//         collections.users.insertOne({
//             _id: id, playlists: [{
//                 _id: 'main',
//                 title: 'main',
//                 tracks: []
//             }]
//         }, (err, result) => {
//             if (err) { reject(err); return; }
//             resolve(result);
//         });
//     });
// },
// createUserPlaylist(id, playlist) {

//     return new Promise((resolve, reject) => {
//         collections.playlists.insertOne(playlist, (err, res) => {
//             if (err) {
//                 reject(err)
//                 return;
//             };
//             collections.users.updateOne({ _id: id }, {
//                 $addToSet: {
//                     'playlists': playlist
//                 }
//             }, { upsert: true }, (err, res) => {
//                 if (err) {
//                     reject(err)
//                 };
//                 resolve(playlist);
//             });
//         });
//     });
// },
// getUserPlaylists(id) {

//     return new Promise((resolve, reject) => {
//         collections.users.findOne({ _id: id }, (err, res) => {
//             if (err) {
//                 // reject(err);
//                 return this.createTelegramUser(id).then(result => {
//                     resolve(result.playlists);
//                 });
//             };
//             if (res) {

//                 var playlists = res.playlists.map(val => {
//                     return val.title;
//                 });
//                 resolve(playlists.reverse());
//             } else {
//                 return this.createTelegramUser(id).then(result => {
//                     resolve(result.playlists);
//                 });
//             }
//         });
//     });
// },
// getUserPlaylistTracks(id, index) {
//     return new Promise((resolve, reject) => {
//         collections.users.findOne({ _id: id }, (err, res) => {
//             if (err) {
//                 // reject(err);
//                 return this.createTelegramUser(id).then(result => {
//                     resolve(result.playlists);
//                 });
//             };
//             if (res && res.playlists[index]) {
//                 resolve(res.playlists[index].tracks);
//             } else {
//                 reject('not found')
//             }
//         });
//     });
// },