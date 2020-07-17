const logistic = require('helper.logistic');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target)
        {
           var exit = creep.room.findExitTo(creep.memory.target);
           creep.moveTo(creep.pos.findClosestByRange(exit));

           return;
        }

        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        else if (creep.memory.working == undefined) {
            creep.memory.working = false;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        else
        {
           this.harvestEnergy(creep);
        }
    },
    harvestEnergy: function(creep) {
        let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (s) => s.store.getUsedCapacity() > 0 });
        if (tombstone != undefined) {
            // iterate through all resources
            for(let resource in tombstone.store) {
                // pickup resource
                if ( ( resource.resourceType == RESOURCE_ENERGY || ( resource.resourceType != RESOURCE_ENERGY && Room.storage != undefined ) ) && creep.withdraw(tombstone, resource) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(tombstone);
                }
            }
        }
        else
        {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            let result = logistic.obtainEnergy(creep, source, true);
            if(result == logistic.obtainResults.withdrawn) {
                creep.memory.working = true;
            }
        }
    }

};
