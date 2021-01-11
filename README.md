## PrismarineJS bot speedrun challenge (Set Seed Glitchless Peaceful)

The seed for this challenge is `2004103968544575047` of version `1.8.9` in peaceful mode. It is based on this run: https://www.speedrun.com/mc/run/yd37l9xz

The goal is to reach the end credit screen the fastest way possible.

### How to participate ?

* Fork this repository
* Clone your fork on your computer
* Install dependencies using `npm i` in the cloned directory
* Copy the `bots/template.js` file into `bots/<your_username>.js`
* Work on your code, evaluate it locally using `npm run test`
* When you are satisfied, make a pull-request, your code will be reviewed and the CI-test will measure your time

### Rules

* Your code must be self-contained in your bot `.js` file
* You can use any npm package
* The timer start when the bot start moving
* The timer end when the bot quit, when it reach the end credit or after 10min

Rules may evolve.

### Strategy

* go to the desert temple to loot the chests
* go to the village to trade and get an eye of ender
* go to the end portal
* defeat ender dragon
