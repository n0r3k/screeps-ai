require('prototype.spawn')();
// import modules
var commonFunctions = require('common.functions');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleAttacker = require('role.attacker');
var roleHealer = require('role.healer');
var roleRanger = require('role.ranger');
var roleMason = require('role.mason');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');

var structureTower = require('structure.tower');

const HOME = 'W5N8';

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
        filter : (s) => s.structureType == STRUCTURE_TOWER
    });

    if ( towers != undefined ) {
      for ( let tower of towers ) {
          structureTower.run(tower);
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
        else if (creep.memory.role == 'ranger') {
            roleRanger.run(creep);
        }
        else if (creep.memory.role == 'mason') {
            roleMason.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
    }

    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 3;
    var minimumNumberOfUpgraders = 3;
    var minimumNumberOfBuilders = 3;
    var minimumNumberOfRepairers = 3;
    var minimumNumberOfAttackers = 2;
    var minimumNumberOfRangers = 2;
    var minimumNumberOfHealers = 1;
    var minimumNumberOfMasons = 2;
    var minimumNumberOflongDistanceHarvesters = 1;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker');
    var numberOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');
    var numberOfRangers = _.sum(Game.creeps, (c) => c.memory.role == 'ranger');
    var numberOfMasons = _.sum(Game.creeps, (c) => c.memory.role == 'mason');
    var numberOflongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester');

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep( energy, 'harvester' );

        if ( name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0 ) {
           Game.spawns.Spawn1.createCustomCreep( Game.spawns.Spawn1.room.energyAvailable, 'harvester' );
        }
    }
    else if (numberOfAttackers < minimumNumberOfAttackers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,MOVE,MOVE,ATTACK], Creep.getRandomName('[Attacker]'),
            { role: 'attacker' });
    }
    else if (numberOfHealers < minimumNumberOfHealers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([HEAL,MOVE], Creep.getRandomName('[Healer]'),
            { role: 'healer' });
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep( energy, 'upgrader' );
    }
    else if (numberOfRangers < minimumNumberOfRangers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCreep([RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE], Creep.getRandomName('[Ranger]'),
            { role: 'ranger', working: false});
    }
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep( energy, 'repairer' );
    }
    else if (numberOfMasons < minimumNumberOfMasons) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep( energy, 'mason' );
    }
    else if (numberOflongDistanceHarvesters < minimumNumberOflongDistanceHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createLongDistanceHarvester( energy, 5, HOME, 'W6N8', 0 );
    }
    // if not enough builders
    // else if (numberOfBuilders < minimumNumberOfBuilders) {
    //     // try to spawn one
    //     name = Game.spawns.Spawn1.createCustomCreep( energy, 'builder' );
    // }
    else {
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCustomCreep( energy, 'builder' );
    }
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
        console.log("Spawned new creep: " + name);
    }
};
