module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
          var rampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: (s) => s.structureType == STRUCTURE_RAMPART
          });

          if ( rampart != undefined ) {
             var result = creep.moveTo( rampart );
             //console.log(result);
          }

          var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

          if ( enemy != undefined ) {
              creep.attack(enemy);
          }
    }
};
