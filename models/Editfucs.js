// models/fuc.js
// Versão revista: usa placeholders (?) em vez de concatenar strings no SQL,
// o que evita injeção de SQL e problemas com aspas/apóstrofos dentro do texto
// (por exemplo em "objetivos", "metod", "aval", que são texto livre).

const sql = require('./db.js');

function EditFuc(
    codFuc, nomeUc, nomeUcEng, nomeCe, areaCient, ano, semestre, caracter, duracao,
    horasTrab, horasCont, ects,
    hrsT, hrsAssT, hrsSincT, hrsTp, hrsAssTp, hrsSincTp,
    hrsPl, hrsAssPl, hrsSincPl, hrsTc, hrsAssTc, hrsSincTc,
    hrsS, hrsAssS, hrsSincS, hrsE, hrsAssE, hrsSincE,
    hrsOt, hrsAssOt, hrsSincOt, hrsO, hrsAssO, hrsSincO,
    hrsTot, hrsAssTot, hrsSincTot, hrsPres, hrsDist,
    nomeResp, grauResp, catResp, cargaResp,
    nomeDoc1, grauDoc1, catDoc1, cargaDoc1,
    nomeDoc2, grauDoc2, catDoc2, cargaDoc2,
    nomeDoc3, grauDoc3, catDoc3, cargaDoc3,
    nomeDoc4, grauDoc4, catDoc4, cargaDoc4,
    nomeDoc5, grauDoc5, catDoc5, cargaDoc5,
    nomeDoc6, grauDoc6, catDoc6, cargaDoc6,
    nomeDoc7, grauDoc7, catDoc7, cargaDoc7,
    nomeDoc8, grauDoc8, catDoc8, cargaDoc8,
    nomeDoc9, grauDoc9, catDoc9, cargaDoc9,
    objectivos, objetivosEn, conteudos, conteudosEn,
    demoCont, demoContEn, metod, metodEn,
    aval, avalEn, demoCoer, demoCoerEn,
    biblio, biblio2, biblio3, biblio4, biblio5,
    obs, obsEn, odsLst, siglaCe, docRespFuc, coordCe,
    anoLetivoFuc, dtaRevFuc, dtaCongFuc,
    callback
) {
    const params = [
        codFuc, nomeUc, nomeUcEng, nomeCe, areaCient, ano, semestre, caracter, duracao,
        horasTrab, horasCont, ects,
        hrsT, hrsAssT, hrsSincT, hrsTp, hrsAssTp, hrsSincTp,
        hrsPl, hrsAssPl, hrsSincPl, hrsTc, hrsAssTc, hrsSincTc,
        hrsS, hrsAssS, hrsSincS, hrsE, hrsAssE, hrsSincE,
        hrsOt, hrsAssOt, hrsSincOt, hrsO, hrsAssO, hrsSincO,
        hrsTot, hrsAssTot, hrsSincTot, hrsPres, hrsDist,
        nomeResp, grauResp, catResp, cargaResp,
        nomeDoc1, grauDoc1, catDoc1, cargaDoc1,
        nomeDoc2, grauDoc2, catDoc2, cargaDoc2,
        nomeDoc3, grauDoc3, catDoc3, cargaDoc3,
        nomeDoc4, grauDoc4, catDoc4, cargaDoc4,
        nomeDoc5, grauDoc5, catDoc5, cargaDoc5,
        nomeDoc6, grauDoc6, catDoc6, cargaDoc6,
        nomeDoc7, grauDoc7, catDoc7, cargaDoc7,
        nomeDoc8, grauDoc8, catDoc8, cargaDoc8,
        nomeDoc9, grauDoc9, catDoc9, cargaDoc9,
        objectivos, objetivosEn, conteudos, conteudosEn,
        demoCont, demoContEn, metod, metodEn,
        aval, avalEn, demoCoer, demoCoerEn,
        biblio, biblio2, biblio3, biblio4, biblio5,
        obs, obsEn, odsLst, siglaCe, docRespFuc, coordCe,
        anoLetivoFuc, dtaRevFuc, dtaCongFuc
    ];

    const placeholders = params.map(() => '?').join(',');

    sql.query(`CALL Qualidade.fuc_upd (${placeholders})`, params, function (err, result) {
        if (err) {
            console.log('Erro: ', err);
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports = EditFuc;