/* eslint-env mocha */

const Wrap = require('minecraft-wrap').Wrap
const download = require('minecraft-wrap').download
const fs = require('fs')
const path = require('path')
const { performance } = require('perf_hooks')
const mineflayer = require('mineflayer')

const MC_SERVER_PATH = path.join(__dirname, 'server')
const MC_VERSION = '1.8.9'

const MC_SERVER_JAR_DIR = `${process.cwd()}/server_jars`
const MC_SERVER_JAR = `${MC_SERVER_JAR_DIR}/minecraft_server.${MC_VERSION}.jar`
const wrap = new Wrap(MC_SERVER_JAR, `${MC_SERVER_PATH}_${MC_VERSION}`)
wrap.on('line', (line) => {
  console.log(line)
})

const propOverrides = {
  'online-mode': 'false',
  difficulty: 0, // peaceful
  'level-seed': '2004103968544575047'
}

describe('challenge', function () {
  this.timeout(10 * 60 * 1000)

  before((done) => {
    console.log('download server jar')
    download(MC_VERSION, MC_SERVER_JAR, (err) => {
      if (err) {
        console.log(err)
        done(err)
        return
      }
      done()
    })
  })

  let bot

  beforeEach((done) => {
    console.log('starting server')
    const PORT = Math.round(30000 + Math.random() * 20000)
    propOverrides['server-port'] = PORT
    wrap.startServer(propOverrides, (err) => {
      if (err) return done(err)

      bot = mineflayer.createBot({
        username: 'bot',
        host: 'localhost',
        port: PORT,
        version: MC_VERSION
      })

      console.log('starting bot')
      bot.once('spawn', () => {
        done()
      })
    })
  })

  afterEach((done) => {
    console.log('stopping server')
    wrap.stopServer((err) => {
      if (err) {
        console.log(err)
      }
      wrap.deleteServerData((err) => {
        if (err) {
          console.log(err)
        }
        done(err)
      })
    })
  })

  const scores = {}

  function formatTime (ms) {
    ms = Math.floor(ms)
    const m = Math.floor(ms / 60000)
    ms -= m * 60000
    const s = Math.floor(ms / 1000)
    ms -= s * 1000
    return (m + '').padStart(2, '0') + ':' + (s + '').padStart(2, '0') + ':' + (ms + '').padStart(3, '0')
  }

  after((done) => {
    console.log('Leaderboard:')
    for (const score of Object.values(scores)) {
      console.log(`${score.name} - ${formatTime(score.elapsed)} ${score.status}`)
    }
    done()
  })

  fs.readdirSync('./bots')
    .filter(file => fs.statSync(`./bots/${file}`).isFile())
    .forEach((test) => {
      test = path.basename(test, '.js')
      const botSetup = require(`../bots/${test}`)
      it(test, (done) => {
        scores[test] = {
          name: test,
          status: 'WAIT',
          start: performance.now()
        }
        const spawnPosition = bot.entity.position.clone()
        bot.on('move', () => {
          if (scores[test].status === 'WAIT' && spawnPosition.distanceSquared(bot.entity.position) > 1) {
            console.log('timer started') // GO!
            scores[test].start = performance.now()
            scores[test].status = 'RUN'
          }
        })
        bot.on('end', () => {
          if (scores[test].status === 'RUN' || scores[test].status === 'WAIT') {
            scores[test].elapsed = performance.now() - scores[test].start
            scores[test].status = 'QUIT'
            done()
          }
        })
        bot._client.on('game_state_change', ({ reason }) => {
          // Enter credits
          if (reason === 4 && (scores[test].status === 'RUN' || scores[test].status === 'WAIT')) {
            scores[test].elapsed = performance.now() - scores[test].start
            scores[test].status = 'SUCCESS'
            done()
          }
        })

        botSetup(bot)
      })
    })
})
