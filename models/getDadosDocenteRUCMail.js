let docente = function getDocente(nomeDocente, callback){
	var sql = require('./db.js');

	sql.query("SELECT login_doc FROM Qualidade.UC_Acesso where nome_doc like '" + nomeDocente + "';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = docente;