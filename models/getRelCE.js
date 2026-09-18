let rel = function getCursos(ce, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("SELECT * FROM Qualidade.getRelCE where AnoLetivo like '" + anoLetivo + "' and idCE = " + ce + ";", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = rel;