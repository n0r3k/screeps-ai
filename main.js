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
var roleClaimer = require('role.claimer');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');

var structureTower = require('structure.tower');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    var towers = _.filter( Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for ( let tower of towers ) {
        structureTower.run(tower);
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
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
    }

    var minimumNumberOflongDistanceHarvesters  = 3;

    for ( let spawnName in Game.spawns )
    {
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

        // count the number of creeps alive for each role
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a harvester
        var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
        var numberOfAttackers = _.sum(creepsInRoom, (c) => c.memory.role == 'attacker');
        var numberOfHealers = _.sum(creepsInRoom, (c) => c.memory.role == 'healer');
        var numberOfRangers = _.sum(creepsInRoom, (c) => c.memory.role == 'ranger');
        var numberOfMasons = _.sum(creepsInRoom, (c) => c.memory.role == 'mason');
        var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
        var numberOfCarriers = _.sum(creepsInRoom, (c) => c.memory.role == 'carrier');
        var numberOflongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester');

        var energy = spawn.room.energyCapacityAvailable;
        var name = undefined;

        if ( numberOfHarvesters == 0 && numberOfMiners == 0 && numberOfCarriers == 0 ) {
            if ( numberOfMiners > 0 ) {
                spawn.createCarrier(spawn.room.energyAvailable);
            }
            else
            {
                spawn.createCustomCreep( spawn.room.energyAvailable, 'harvester' );
            }
        }

        let sources = spawn.room.find(FIND_SOURCES);
        for ( let source of sources ) {
            if ( !_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                });

                if ( containers.length > 0 ) {
                    name = spawn.createMiner(source.id);
                    break;
                }
            }
        }

        if (name == undefined) {
            // if not enough harvesters
            if (numberOfHarvesters < spawn.memory.minHarvesters) {
                // try to spawn one
                name = spawn.createCustomCreep( energy, 'harvester' );
            }
            else if (numberOfCarriers < spawn.memory.minCarriers) {
                // try to spawn one
                name = spawn.createCarrier(300);
            }
            else if (spawn.memory.claimRoom != undefined) {
                name = spawn.createClaimer( spawn.memory.claimRoom );
                if (!(name < 0)) {
                   delete spawn.memory.claimRoom;
                }
            }
            else if (numberOfAttackers < spawn.memory.minAttackers) {
                // try to spawn one
                name = spawn.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,ATTACK], Creep.getRandomName('[Attacker]'),
                    { role: 'attacker' });
            }
            else if (numberOfHealers < spawn.memory.minHealers) {
                // try to spawn one
                name = spawn.createCreep([HEAL,MOVE], Creep.getRandomName('[Healer]'),
                    { role: 'healer' });
            }
            // if not enough upgraders
            else if (numberOfUpgraders < spawn.memory.minUpgraders) {
                // try to spawn one
                name = spawn.createCustomCreep( energy, 'upgrader' );
            }
            else if (numberOfRangers < spawn.memory.minRangers) {
                // try to spawn one
                name = spawn.createCreep([RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE], Creep.getRandomName('[Ranger]'),
                    { role: 'ranger', working: false});
            }
            else if (numberOfRepairers < spawn.memory.minRepairers) {
                // try to spawn one
                name = spawn.createCustomCreep( energy, 'repairer' );
            }
            else if (numberOfMasons < spawn.memory.minMasons) {
                // try to spawn one
                name = spawn.createCustomCreep( energy, 'mason' );
            }
            else if (numberOflongDistanceHarvesters < minimumNumberOflongDistanceHarvesters) {
                // try to spawn one
                let targetRoom = undefined;

                if ( spawn.room.name == 'W5N8' ) {
                  targetRoom = 'W6N8';
                } else if ( spawn.room.name == 'E22S15' ) {
                  targetRoom = 'E21S15';
                }

                if ( targetRoom != undefined ) {
                  name = spawn.createLongDistanceHarvester( energy, 5, spawn.room.name, targetRoom, 0 );
                }
            }
            // if not enough builders
            else if (numberOfBuilders < spawn.memory.minBuilders) {
                // try to spawn one
                name = spawn.createCustomCreep( energy, 'builder' );
            }
            else {
                // else try to spawn a builder
                //name = spawn.createCustomCreep( energy, 'builder' );
                name = -1;
            }
        }

        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name);
        }
    }
};
