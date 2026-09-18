let cursos = function getCursos(sigla, callback){
	var sql = require('./db.js');

	sql.query("select * from Qualidade.cursos where sigla like '" + sigla + "' order by ies,ciclo ;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = cursos;