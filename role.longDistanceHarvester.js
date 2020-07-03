var roleRepairer = require('role.repairer');

module.exports = {
    name: 'longDistanceHarvester',
    miningConfigs: [
        [WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        [WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        [WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
        [WORK, WORK, CARRY, MOVE],
        [WORK, CARRY, MOVE]
    ],
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn
        if (creep.memory.working == true) {
            if ( creep.room.name == creep.memory.home ) {
              // transfer in order
              for (let structureType of [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]) {
                  let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                      filter: (s) => s.structureType == structureType && s.energy < s.energyCapacity
                  });

                  if ( structure != undefined ) {
                     if ( creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                     }

                     break;
                  }
               }
            }
            else
            {
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else
        {
            if (creep.room.name == creep.memory.target)
            {
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                // try to harvest energy, if the source is not in rang
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                   // move towards the source
                   creep.moveTo(source);
                }
            }
            else
            {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};
