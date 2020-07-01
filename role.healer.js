module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
          var damagedCreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax
          });

          if ( damagedCreep != undefined ) {
              if (creep.heal(damagedCreep) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(damagedCreep);
              }
          }
    }
};
