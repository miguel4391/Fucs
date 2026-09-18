let fuc = function delFuc(id, callback){
	var sql = require('./db.js');

	sql.query("delete from Qualidade.fucs where idFucs =" + id + ";", (err, result) => {
		if(err){
			console.log(err);
		}else{
			callback(null, result);
		}
	})
}

module.exports = fuc;
