let cursos = function getCursos(user, callback){
	var sql = require('./db.js');

	sql.query("select * from Qualidade.cursos where login like '%" + user + ";%' order by ies,ciclo ;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = cursos;
