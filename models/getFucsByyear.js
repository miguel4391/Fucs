let lstUCs = function getCursos(idCurso, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("select distinct nomeUCPt, ano, idfucs, nomeCE, coordCe from Qualidade.fucs inner join Qualidade.cursos on Qualidade.fucs.curso_sigla like Qualidade.cursos.sigla where Qualidade.cursos.idCursos = " + idCurso + " and anoLetivoFuc = '" + anoLetivo + "' order by Qualidade.fucs.ano;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = lstUCs;