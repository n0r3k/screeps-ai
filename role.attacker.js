module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target)
        {
           var exit = creep.room.findExitTo(creep.memory.target);
           creep.moveTo(creep.pos.findClosestByRange(exit));

           return;
        }

          var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    
          if ( enemy != undefined ) {
              if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(enemy);
              }
          }
    }
};
