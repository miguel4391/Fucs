let relUC = function getRelUC(idRUC, callback){
	var sql = require('./db.js');

	sql.query("select * FROM Qualidade.relUC where idrelUC = " + idRUC + ";", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = relUC;