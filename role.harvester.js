var roleRepairer = require('role.repairer');
const logistic = require('helper.logistic');

module.exports = {
    name: 'harvester',
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
            // transfer in order
            for (let structureType of [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_STORAGE]) {
                let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == structureType && s.energy < s.energyCapacity
                });

                if ( structure != undefined ) {
                   if ( creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(structure);
                   }

                   break;
                }
                // if nowhere to transfer, do repairing work
                else
                {
                    roleRepairer.run(creep);
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
          this.harvestEnergy(creep);
       }
   },
   harvestEnergy: function(creep) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        let result = logistic.obtainEnergy(creep, source, true);
        if(result == logistic.obtainResults.withdrawn) {
            creep.memory.working = true;
        }
    }
};
