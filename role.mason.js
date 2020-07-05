var roleBuilder = require('role.builder');
const logistic = require('helper.logistic');

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
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            let result = logistic.obtainEnergy(creep, source, true);
            if(result == logistic.obtainResults.withdrawn) {
                creep.memory.working = true;
            }
        }
    }
};
