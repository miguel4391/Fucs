var Uc = function setUCAcesso(idUC, anoLetivo, nrIscrit, media, percReprov, percAprov, callback){
    var sql = require('./db.js');

    sql.query("UPDATE `Qualidade`.`fucsRelCE` SET `nrInscriUC` = " + nrIscrit + ",`avgUC` = " + media + ",`percReprov` = " + percReprov + ",`percAprov` = " + percAprov + " WHERE `idUCRelCe` = " + idUC + " and anoLetivoRelCE like '" + anoLetivo + "';", (err, result) => {
        if(err){
            console.log('Erro: ', err);
        }else{
            callback(null, result);
        }
    });
}

module.exports = Uc;