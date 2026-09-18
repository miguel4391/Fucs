let relUC = function getRelUC(uc, curso, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("select * FROM Qualidade.relUC where anoLetivo = '" + anoLetivo.replace('_', '-') + "' and uc = '" + uc + "' and ce = '" + curso + "';", (err, result) => {
		
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = relUC;