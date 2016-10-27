const {h, Component} = require('preact')
const TitleBar = require('./TitleBar')
const TrackInfo = require('./TrackInfo')
const LyricsBox = require('./LyricsBox')

const spotify = require('../../modules/spotify')
const lyrics = require('../../modules/lyrics')

class App extends Component {
    constructor() {
        super()

        spotify.on('song-update', ({track, playing_position}) => {
            this.state = {}
            this.setState({
                loading: true,
                title: track.track_resource.name,
                artists: [track.artist_resource.name],
                album: track.album_resource.name,
                position: playing_position,
                total: track.length
            })

            let query = [this.state.title, this.state.artists].join(' ')

            lyrics.get(query, (err, result) => {
                if (err) return this.setState({loading: false})

                result.loading = false
                this.setState(result)
            })
        })

        spotify.on('song-progress', ({track, playing_position}) => {
            this.setState({
                position: playing_position,
                total: track.length
            })
        })

        window.addEventListener('load', () => spotify.listen())
    }

    render({}, {loading, title, artists, album, art, lyrics, url, position, total}) {
        return h('div', {id: 'root'},
            h(TitleBar),
            h(TrackInfo, {loading, title, artists, album, art}),
            h('main', {},
                h(LyricsBox, {loading, lyrics, url, position, total}),
                h('div', {class: 'fade-in'}),
                h('div', {class: 'fade-out'})
            )
        )
    }
}

module.exports = App
