let ucs = function getCursos(ce, callback){
	var sql = require('./db.js');

	sql.query("SELECT distinct fucs.nomeUCPt as 'UC', Qualidade.UC_Acesso.uc as 'IdFuc', Qualidade.UC_Acesso.nome_doc as 'Nome', Qualidade.UC_Acesso.login_doc as 'Login',Qualidade.fucs.editavel as 'Editavel',doc2Nome,doc3Nome,doc4Nome,doc5Nome,doc6Nome,doc7Nome,doc8Nome,doc9Nome,doc10Nome   FROM Qualidade.UC_Acesso INNER JOIN Qualidade.fucs on UC_Acesso.UC = fucs.idFucs where UC_Acesso.curso =" + ce + " order by nomeUCPt;", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = ucs;