var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair a structure
        if (creep.memory.working == true) {
            // find closest constructionSite by priority
            var structureTypes = [STRUCTURE_TOWER, STRUCTURE_RAMPART, STRUCTURE_EXTENSION, STRUCTURE_ROAD];
            for (let structureType of structureTypes) {
                let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == structureType && s.hits < (s.structureType == STRUCTURE_RAMPART ? 50000 : s.hitsMax)
                });

                if ( structure != undefined ) {
                   //console.log(structure);
                   if ( creep.repair(structure) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(structure);
                   }

                   break;
                }
                else
                {
                    // if no structure find, find any other structure
                    structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL
                    });

                    // if one is found
                    if (structure != undefined) {
                        // try to build, if the structures is not in range
                        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                            // move towards the structures
                            creep.moveTo(structure);
                        }
                    }
                    // if no constructionSite is found
                    else {
                        // go upgrading the controller
                        roleBuilder.run(creep);
                    }
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
    }
};
