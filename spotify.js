const deepEqual = require('deep-equal')
const spotify = new require('node-spotify-webhelper').SpotifyWebHelper()
const EventEmitter = require('events')

let loopId, lastSongId

module.exports = exports = new EventEmitter()

let getTrackId = track => ['track', 'artist', 'album'].map(x => track[x + '_resource'].uri)

exports.start = function() {
    let loop = () => spotify.getStatus((err, result) => {
        if (err || result.error || !result.running) return

        clearTimeout(loopId)
        loopId = setTimeout(loop, Math.min(1000, (result.track.length - result.playing_position) * 1000))

        if (deepEqual(lastSongId, getTrackId(result.track))) return

        lastSongId = getTrackId(result.track)
        exports.emit('song-update', result)
    })

    loop()
}

exports.stop = function() {
    clearTimeout(loopId)
}