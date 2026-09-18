let isLogged = function setLogin(user,pass, callback){
    var sql = require('./db.js');
    
    sql.query("select pass from acessoFucs where user='" + user + "';", (err, result) => {

	if(err){
            console.log('Erro: ', err);
        }else{
			if(result[0]){
					
            	if(result[0].pass === pass){
                	console.log('Logged In');
                	callback(null, true);
            	}else{
                	console.log('Not Logged In');
                	callback(null, false);
            	}
			}else{
                	console.log('Not Logged In');
                	callback(null, false);

			}
        }
    })
}

module.exports = isLogged;
