let lstUCs = function getCursos(sigla, user, role, ano, callback){
	var sql = require('./db.js');
	if(role=='docente'){
		sql.query("SELECT distinct fucs.nomeUCPt as 'UC', Qualidade.UC_Acesso.uc as 'IdFuc'  FROM Qualidade.UC_Acesso INNER JOIN Qualidade.fucs on UC_Acesso.UC = fucs.idFucs where UC_Acesso.login_doc like '" + user + "' and Qualidade.fucs.curso_sigla like '" + sigla +"' and Qualidade.fucs.anoLetivoFuc like '"+ ano +"' order by nomeUCPt;", (err, result) => {
			if(err){
				console.log(err);
			}else{
				callback(null, result);
			}
		})
	}else if(role=='coordenador' || role=='administrador' || role=='gestor'){
		sql.query("SELECT distinct fucs.nomeUCPt as 'UC', Qualidade.UC_Acesso.uc as 'IdFuc'  FROM Qualidade.UC_Acesso INNER JOIN Qualidade.fucs on UC_Acesso.UC = fucs.idFucs where Qualidade.fucs.curso_sigla like '" + sigla +"' and Qualidade.fucs.anoLetivoFuc like '"+ ano +"' order by nomeUCPt;", (err, result) => {
			if(err){
				console.log(err);
			}else{
				callback(null, result);
			}
		})
	}
	
}

module.exports = lstUCs;