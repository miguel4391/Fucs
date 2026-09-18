let finalizado = function setFinalizados(ce, anoLetivo, callback){
	var sql = require('./db.js');

	sql.query("update relCE set finalizado=0 where idCe='" + ce + "' and anoLetivo='" + anoLetivo + "';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = finalizado;