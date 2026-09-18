let cursos = function getCursos(user,ano, callback){
	var sql = require('./db.js');

	sql.query("select * from Qualidade.cursos where anoLetivo like '" + ano + "' order by ies,ciclo ;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = cursos;