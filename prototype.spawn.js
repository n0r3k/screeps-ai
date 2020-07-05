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

   StructureSpawn.prototype.createLongDistanceHarvester = function(energy, numberOfWorkParts, home, target, sourceIndex) {
       let body = [];
       for ( let i = 0; i < numberOfWorkParts; i++ ) {
           body.push(WORK);
       }

       energy -= 150 * numberOfWorkParts;

       let numberOfParts = Math.floor( energy / 100 );
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(CARRY);
       }
       for ( let i = 0; i < numberOfParts + numberOfWorkParts; i++ ) {
           body.push(MOVE);
       }

       return this.createCreep( body, Creep.getRandomName('[longDistanceHarvester]'), {
         role: 'longDistanceHarvester',
         home: home,
         target: target,
         sourceIndex: sourceIndex,
         working: false
       });
   }

   StructureSpawn.prototype.createClaimer = function(target) {
      return this.createCreep( [CLAIM, MOVE], Creep.getRandomName('[claimer]'), {
         role: 'claimer',
         target: target
      });
   }

   StructureSpawn.prototype.createMiner = function(sourceId) {
      return this.createCreep( [WORK, WORK, WORK, WORK, WORK, MOVE], Creep.getRandomName('[miner]'), {
         role: 'miner',
         sourceId: sourceId
      });
   }

   StructureSpawn.prototype.createCarrier = function(energy) {
       let numberOfParts = Math.floor( energy / 150 );
       let body = [];
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(CARRY);
       }
       for ( let i = 0; i < numberOfParts; i++ ) {
           body.push(MOVE);
       }

       return this.createCreep( body, Creep.getRandomName('[carrier]'), { role: 'carrier', working: false });
   }
};
