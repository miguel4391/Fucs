let lstUCs = function getCursos(sigla, callback){
	var sql = require('./db.js');

	sql.query("SELECT distinct nomeUCPt, idfucs  FROM Qualidade.fucs where curso_sigla like '" + sigla + "' order by nomeUCPt;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = lstUCs;