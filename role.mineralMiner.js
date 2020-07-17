module.exports = {
    name: 'mineralMiner',
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing mineral to the spawn but has no minerals left
        if (creep.memory.working == true && (creep.store.getUsedCapacity() == 0 || creep.ticksToLive < 100)) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting mineral but is full
        else if (creep.memory.working == false && creep.store.getUsedCapacity() == creep.store.getCapacity() ) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer minerals to the storage
        if (creep.memory.working == true) {
            let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            });

            for(const resourceType in creep.carry) {
                if ( creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(storage);
                }
            }
        }
        // if creep is supposed to extract minerals from source
        else {
          // extract resource
          let extractor = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
              filter: (s) => s.structureType == STRUCTURE_EXTRACTOR
          });

          let mineral = creep.pos.findClosestByPath(FIND_MINERALS);

          if ( mineral != undefined && extractor != undefined && mineral.pos.x == extractor.pos.x && mineral.pos.y == extractor.pos.y && extractor.isActive()) {
            if ( creep.harvest( mineral ) == ERR_NOT_IN_RANGE ) {
                creep.moveTo( mineral );
            }
          }
       }
   }
};
