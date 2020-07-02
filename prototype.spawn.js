require('common.functions');

module.exports = function() {
   StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
       let numberOfParts = Math.floor( energy / 200 );
       let body = [];
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(WORK);
       }
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(CARRY);
       }
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(MOVE);
       }

       return this.createCreep( body, Creep.getRandomName('[' + roleName + ']'), { role: roleName, working: false });
   }
};
