var roleUpgrader = require('role.upgrader');
const logistic = require('helper.logistic');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target)
        {
           var exit = creep.room.findExitTo(creep.memory.target);
           creep.moveTo(creep.pos.findClosestByRange(exit));
        }

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

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if ( container != undefined ) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(container);
                }
            }
            else {
              this.harvestEnergy(creep);
           }
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
