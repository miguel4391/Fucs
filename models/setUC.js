var Uc = function setUCAcesso(idUC, nomeDoc,cat, grau, loginDoc, editavel, callback){
    var sql = require('./db.js');

    sql.query("call UC_Acesso_upd (" + idUC + ",'" + nomeDoc + "','" + cat + "','" + grau +  "','" + loginDoc + "'," + editavel + ");", (err, result) => {
        if(err){
            console.log('Erro: ', err);
        }else{
            callback(null, result);
        }
    });
}

module.exports = Uc;