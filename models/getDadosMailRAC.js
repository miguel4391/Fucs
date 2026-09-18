let cursos = function getCursos(codCE, callback){
	var sql = require('./db.js');

	sql.query("select * from Qualidade.cursos where idCursos =" + codCE + ";", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = cursos;