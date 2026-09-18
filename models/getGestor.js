let gestor = function getCursos(user, callback){
	var sql = require('./db.js');

	sql.query("SELECT * FROM Qualidade.gestoresFucs where login = '" + user + "';", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = gestor;