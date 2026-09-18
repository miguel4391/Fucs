let curso = function getCursos(ce, ano, callback){
	var sql = require('./db.js');

	sql.query("SELECT nomeExt as 'Curso', login as 'Login', idCursos as 'idCurso', nomeCoord as 'NomeCoord', ies as 'ies' FROM Qualidade.cursos where sigla like '" + ce +"' and anoLetivo like '"+ ano +"';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = curso;