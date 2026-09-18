var Aband = function setUCAcesso(codCe, anoLetivo, tbNrAband_1ano,tbNrAband_2ano, tbNrAband_3ano, tbNrAband_4ano, tbNrAband_5ano, tbNrAnul_1ano, tbNrAnul_2ano, tbNrAnul_3ano, tbNrAnul_4ano, tbNrAnul_5ano, callback){
    var sql = require('./db.js');

    sql.query("UPDATE `Qualidade`.`abandonoRelCE` SET `dropCE` = " + tbNrAband_1ano + ",`dropIncri` = " + tbNrAnul_1ano + " WHERE `idCERelCE` = " + codCe + " and anoLetivo like '" + anoLetivo + "' and anoCurricular=1;", (err1, result1) => {
        if(err1){
            console.log('Erro: ', err1);
        }else{
            sql.query("UPDATE `Qualidade`.`abandonoRelCE` SET `dropCE` = " + tbNrAband_2ano + ",`dropIncri` = " + tbNrAnul_2ano + " WHERE `idCERelCE` = " + codCe + " and anoLetivo like '" + anoLetivo + "' and anoCurricular=2;", (err2, result2) => {
                if(err2)
                    console.log('Erro: ', err2);
                else{
                    if(tbNrAband_3ano != ""){
                        sql.query("UPDATE `Qualidade`.`abandonoRelCE` SET `dropCE` = " + tbNrAband_3ano + ",`dropIncri` = " + tbNrAnul_3ano + " WHERE `idCERelCE` = " + codCe + " and anoLetivo like '" + anoLetivo + "' and anoCurricular=3;", (err3, result3) => {
                            if(err3)
                                console.log('Erro: ', err3);
                            else{
                                if(tbNrAband_4ano != ""){
                                    sql.query("UPDATE `Qualidade`.`abandonoRelCE` SET `dropCE` = " + tbNrAband_4ano + ",`dropIncri` = " + tbNrAnul_4ano + " WHERE `idCERelCE` = " + codCe + " and anoLetivo like '" + anoLetivo + "' and anoCurricular=4;", (err4, result4) => {
                                        if(err4)
                                            console.log('Erro: ', err4);
                                        else{
                                            if(tbNrAband_5ano != ""){
                                                 sql.query("UPDATE `Qualidade`.`abandonoRelCE` SET `dropCE` = " + tbNrAband_5ano + ",`dropIncri` = " + tbNrAnul_5ano + " WHERE `idCERelCE` = " + codCe + " and anoLetivo like '" + anoLetivo + "' and anoCurricular=5;", (err5, result5) => {
                                                    if(err5){
                                                        console.log('Erro: ', err5);
                                                    }
                                                    else{
                                                        callback(null, result5);
                                                    }
                                                })
                                            }
                                            else{
                                                callback(null, result4);
                                            }
                                        }
                                    })
                                }else{
                                    callback(null, result3);
                                }
                            }
                        })
                    }else{
                        callback(null, result2);
                    }
                }
            })
            //console.log('Result-> ', result1)
            //callback(null, result1);
        }
    });
}

module.exports = Aband;