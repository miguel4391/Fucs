let docente = function getDocente(nomeCurso, callback){
	var sql = require('./db.js');

	sql.query("SELECT  login as login_doc FROM Qualidade.cursos where nomeEXT ='" + nomeCurso + "';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = docente;