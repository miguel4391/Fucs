let fuc = function getCursos(id, callback){
	var sql = require('./db.js');

	sql.query("select * from Qualidade.fucs where nomeUCPt in (SELECT nomeUCPt FROM Qualidade.fucs where idfucs =" + id + ");", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = fuc;