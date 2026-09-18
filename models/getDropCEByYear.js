let drop = function getDrops(idCE, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("SELECT * FROM Qualidade.abandonoRelCE where idCERelCE =" + idCE + " and anoLetivo like '" + anoLetivo + "' order by anoCurricular;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = drop;