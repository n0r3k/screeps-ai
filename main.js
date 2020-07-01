// import modules
var commonFunctions = require('common.functions');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attacker');
var roleHealer = require('role.healer');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        else if (creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }
    }

    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 5;
    var minimumNumberOfUpgraders = 5;
    var minimumNumberOfBuilders = 8;
    var minimumNumberOfRepairers = 5;
    var minimumNumberOfAttackers = 2;
    var minimumNumberOfHealers = 1;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker');
    var numberOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');

    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], Creep.getRandomName('[Harvester]'),
            { role: 'harvester', working: false});
    }
    else if (numberOfAttackers < minimumNumberOfAttackers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,ATTACK,MOVE], Creep.getRandomName('[Attacker]'),
            { role: 'attacker' });
    }
    else if (numberOfHealers < minimumNumberOfHealers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([HEAL,HEAL,MOVE], Creep.getRandomName('[Healer]'),
            { role: 'healer' });
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], Creep.getRandomName('[Upgrader]'),
            { role: 'upgrader', working: false});
    }
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], Creep.getRandomName('[Repairer]'),
            { role: 'repairer', working: false});
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], Creep.getRandomName('[Builder]'),
            { role: 'builder', working: false});
    }
    else {
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], Creep.getRandomName('[Builder]'),
            { role: 'builder', working: false});
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
        console.log("Spawned new creep: " + name);
    }
};
