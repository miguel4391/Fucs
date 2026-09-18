let fuc = function setNewFuc(nomeUc, nomeUcEng,nomeCe, areaCient, ano, semestre, caracter, duracao, horasTrab, horasCont, ects, hrsT, hrsAssT, hrsSincT, hrsTp, hrsAssTp, hrsSincTp,hrsPl, hrsAssPl, hrsSincPl, hrsTc, hrsAssTc, hrsSincTc, hrsS, hrsAssS, hrsSincS, hrsE,hrsAssE, hrsSincE, hrsOt, hrsAssOt, hrsSincOt, hrsO, hrsAssO, hrsSincO, hrsTot, hrsAssTot,	hrsSincTot, hrsPres, hrsDist, nomeResp, grauResp, catResp, cargaResp, nomeDoc1, grauDoc1,catDoc1, cargaDoc1, nomeDoc2, grauDoc2, catDoc2, cargaDoc2, objectivos, objetivosEn, conteudos, conteudosEn, demoCont, demoContEn, metod, metodEn, aval, avalEn, demoCoer,	demoCoerEn, biblio, biblio2, biblio3, biblio4, biblio5, obs, obsEn, odsLst, siglaCe, docRespFuc,coordCe, anoLetivoFuc, dtaRevFuc, callback){
	var sql = require('./db.js');

	sql.query("call Qualidade.fuc_ins ('"+nomeUc+"','"+nomeUcEng+"','"+nomeCe+"','"+areaCient+"','"+ano+"','"+semestre+"','"+caracter+"','"+duracao+"','"+horasTrab+"','"+horasCont+"','"+ects+"','"+hrsT+"','"+hrsAssT+"','"+hrsSincT+"','"+hrsTp+"','"+hrsAssTp+"','"+hrsSincTp+"','"+hrsPl+"','"+hrsAssPl+"','"+hrsSincPl+"','"+hrsTc+"','"+hrsAssTc+"','"+hrsSincTc+"','"+hrsS+"','"+hrsAssS+"','"+hrsSincS+"','"+hrsE+"','"+hrsAssE+"','"+hrsSincE+"','"+hrsOt+"','"+hrsAssOt+"','"+hrsSincOt+"','"+hrsO+"','"+hrsAssO+"','"+hrsSincO+"','"+hrsTot+"','"+hrsAssTot+"','"+hrsSincTot+"','"+hrsPres+"','"+hrsDist+"','"+nomeResp+"','"+grauResp+"','"+catResp+"','"+cargaResp+"','"+nomeDoc1+"','"+grauDoc1+"','"+catDoc1+"','"+cargaDoc1+"','"+nomeDoc2+"','"+grauDoc2+"','"+catDoc2+"','"+cargaDoc2+"','"+objectivos+"','"+objetivosEn+"','"+conteudos+"','"+conteudosEn+"','"+demoCont+"','"+demoContEn+"','"+metod+"','"+metodEn+"','"+aval+"','"+avalEn+"','"+demoCoer+"','"+demoCoerEn+"','"+biblio+"','"+biblio2+"','"+biblio3+"','"+biblio4+"','"+biblio5+"','"+obs+"','"+obsEn+"','"+odsLst+"','"+siglaCe+"','"+docRespFuc+"','"+coordCe+"','"+anoLetivoFuc+"','"+dtaRevFuc+"');", function(err, result){
		if(err){
			console.log("Erro: ", err); 
		}else{
			callback(null, result);
		}
	});
}

module.exports = fuc;
