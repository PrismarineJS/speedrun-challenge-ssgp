// This is the template bot file, make your own copy before editing
// Your bot file must be in this bots/ folder and be named <your username>.js

const viewer = require('prismarine-viewer').mineflayer
const { pathfinder } = require('mineflayer-pathfinder')
const { GoalBlock } = require('mineflayer-pathfinder').goals

module.exports = (bot) => {
  bot.loadPlugin(pathfinder)

  // View the world for debug purpose
  viewer(bot, { port: 3000 })

  // Go inside the temple and quit
  bot.on('goal_reached', (goal) => {
    console.log('arrived', bot.entity.position)
    bot.quit()
  })
  bot.pathfinder.setGoal(new GoalBlock(-324.5, 65, -133.5))
}
