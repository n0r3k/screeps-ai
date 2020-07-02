module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
          var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

          if ( enemy != undefined ) {
              if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(enemy);
              }
          }
    }
};
