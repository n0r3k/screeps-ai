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
           let walls = creep.room.find(FIND_STRUCTURES, {
              filter: (s) => s.structureType == STRUCTURE_WALL
           });

           var target = undefined;

           for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001 ) {
               for ( let wall of walls ) {
                   if ( wall.hits / wall.hitsMax < percentage ) {
                      target = wall;
                      break;
                   }
               }

               if ( target != undefined ) {
                 break;
               }
           }

           if ( target != undefined ) {
              if ( creep.repair( target ) == ERR_NOT_IN_RANGE ) {
                 creep.moveTo( target );
              }
           }
           else
           {
              roleBuilder.run( creep );
           }
        }
        // if creep is supposed to harvest energy from source
        else {
            var resources = creep.pos.lookFor(LOOK_ENERGY);
            // TODO: fix to work with any resource (and not pickup resource even if we want energy)
            if(resources.length > 0 && resources[0].resourceType == RESOURCE_ENERGY) {
                return creep.pickup(resources[0]) == OK;
            }

            // find closest source
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if ( container != undefined ) {
                // try to harvest energy, if the source is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(container);
                }
            }
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
    }
};
