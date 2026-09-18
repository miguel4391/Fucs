let fuc = function getCursos(idCE, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("SELECT * FROM Qualidade.fucsRelCE where idCERelCE =" + idCE + " and anoLetivoRelCE like '" + anoLetivo + "';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = fuc;