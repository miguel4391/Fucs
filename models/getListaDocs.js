let listaDoc = function getListaDOc(cursoIes, callback){
	var sql = require('./db.js');

	sql.query("SELECT * FROM Qualidade.fichaDoc_slt where vinculoIes = '" + cursoIes + "' and ativo=1 order by nomeDoc ", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = listaDoc;