var express 	= require("express");
var bodyParser 	= require("body-parser");
var flash 	= require ("connect-flash");
const isLogged 	= require("../models/login.js");
const session 	= require("express-session");
var passport = require('passport');
const e = require("connect-flash");
const relUC = require("../models/getRelUCById.js");
const listaDoc = require("../models/getListaDocs.js");
var LdapStrategy = require('passport-ldapauth').Strategy;
var router 	= express.Router();


//var role ="";


router.get("/", isLoggedIn, (req, res) => {
	res.render("menu", {role:req.session.role})
});

router.get("/login", (req, res) => {
	res.render("login");
});


router.post("/login", (req, res, next) => {
	//role = req.body.role;
	next();
}, passport.authenticate("ldapauth", {
	failureRedirect: '/',
	failureFlash: false
}), (req, res)=>{
	
	if(req.body.role==='docente'){
		req.session.user = req.body.username;
		req.session.role = req.body.role;
		return res.redirect("/docente")
	}
	else if(req.body.role==='coordenador'){
		req.session.user = req.body.username;
		req.session.role = req.body.role;
		return res.redirect("/coordenador")
	}
	else if(req.body.role==='administrador'){
		req.session.user = req.body.username;
		req.session.role = req.body.role;
		return res.redirect("/administrador")
	} else if(req.body.role=== 'gestor'){
		req.session.user = req.body.username;
		req.session.role = req.body.role;
		return res.redirect("/gestor")
	}
	else
		res.locals.error = "Erro de Login";
});
	
router.get("/docente", isLoggedIn, (req, res) =>{
	console.log(req.session.role)
	res.render("menu", {role:req.session.role});
})

router.get("/coordenador", isLoggedIn, (req, res) =>{
	console.log(req.session.role)
	res.render("menu", {role:req.session.role});
})
router.get("/administrador", isLoggedIn, (req, res) =>{
	console.log(req.session.role)
	if(req.session.user == "presidentegrupoEIA" || req.session.user == "nataliaes" || req.session.user == "mfreitas" || req.session.user == "hjose" || req.session.user=="cduarte" || req.session.user =="ncarvalho")
		res.render("menu", {role:req.session.role});
	else{
		res.locals.error = "Utilizador sem premissão";
		res.render("login");
	}
})
router.get("/gestor", isLoggedIn, (req, res) =>{
	console.log(req.session.role)
	let gestor = require("../models/getGestor.js")(req.session.user, (err, gestor) =>{
		if(err){
			console.log(err);
		}else{
			if(gestor != null && gestor.length > 0){
				res.render("menu", {role:req.session.role});
			}else{
				res.locals.error = "Sem acesso ao perfil";
				res.render("login")
			}
		}
	})
})



router.get("/menu",isLoggedIn, (req, res) =>{
	if(role==='docente'){
		req.session.user = req.body.username;
		return res.redirect("/docente")
	}
	else if(role==='coordenador'){
		req.session.user = req.body.username;
		return res.redirect("/coordenador")
	}
	else if(role==='administrador'){
		req.session.user = req.body.username;
		return res.redirect("/administrador")
	} else if(role=== 'gestor'){
		req.session.user = req.body.username;
		return res.redirect("/gestor")
	}
	else
		res.render("login");
})

router.get("/menuDocente",isLoggedIn, (req, res) =>{
	res.render("menuDocente");
})

router.get("/landing", isLoggedIn, (req, res) =>{
	let cursos = require("../models/cursos.js")(req.session.user, req.session.role, obterAnoLetivo(), (err,cursos) => {
		if(err){
			console.log(err);
		}else{
			console.log("cursos -> ",cursos)
			res.render("landing", {cursos:cursos});
		}
	})
})

/* router.get("/editaCurso", isLoggedIn,(req, res) =>{
	console.log(req.session.user)
	let cursos = require("../models/cursos.js")(req.session.user, (err, cursos) =>{
		if(err)
			console.log(err);
		else
			res.render("editaCurso", {cursos:cursos})
	})
}) */

router.get("/editaCursoAno", isLoggedIn, (req, res) =>{
	res.render("editaCursoAno");
})

router.get("/editaCurso/:anoLetivo", isLoggedIn,(req, res) =>{
	let ano = req.params.anoLetivo.replace('_', '/');
	let cursos = require("../models/cursos.js")(req.session.user, req.session.role, ano, (err, cursos) =>{
		if(err)
			console.log(err);
		else
			console.log(cursos)
			res.render("editaCurso", {cursos:cursos, ano:ano})
	})
})
router.get("/editaRUC", isLoggedIn,(req, res) =>{
	let cursos = require("../models/cursos.js")(req.session.user, req.session.role,"2025/26", (err, cursos) =>{
		if(err)
			console.log(err);
		else
			console.log(cursos)
			res.render("editaRUC", {cursos:cursos})
	})
})

router.get("/editaRAC", isLoggedIn,(req, res) =>{
	let cursos = require("../models/cursos.js")(req.session.user, req.session.role, "2025/26", (err, cursos) =>{
		if(err)
			console.log(err);
		else
			console.log(cursos)
			res.render("editaRAC", {cursos:cursos})
	})
})


router.get("/getUC/:ce/:anoLetivo", isLoggedIn, (req, res) =>{
	let ano = req.params.anoLetivo.replace('_', '/');
	let lstUcs = require("../models/getUCbyCE.js")(req.params.ce, req.session.user, req.session.role, ano, (err,lstUcs) =>{
		if(err)
			console.log(err);
		else
			res.send(lstUcs);
	})
})


router.get("/getFuc/:id",isLoggedIn, (req, res) =>{
	let idUc = req.params.id;
	
	let fuc = require("../models/getFucbyId.js")(idUc, (err, fuc) =>{
		if(err)
			console.log(err);
		else{
			let cursos = require("../models/cursos4.js")(fuc[0].curso_sigla, (err,cursos) => {
				console.log(fuc);
				if(err)
					console.log(err);
				else{
					let listaDoc = require("../models/getListaDocs.js")(cursos[0].ies, (err, listaDoc) =>{
						if(err)
							console.log(err);
						else{
							res.render("editaFuc", {fuc:fuc, cursos:cursos, role:req.session.role,listaDoc:listaDoc})
						}
					})
				}
			})
		}
			
	})
	console.log('uc -> ',idUc);
})

router.get("/regentesAno", isLoggedIn, (req, res) =>{
	res.render("regentesAno");
})

router.get("/regentes/:anoLetivo", isLoggedIn, (req, res) => {
	//Ir buscar login à tabela
	let user = req.session.user;
	let ano = req.params.anoLetivo.replace('_', '/');
	let cursos = require("../models/cursos.js")(user, req.session.role, ano, (err, cursos) => {
		if(err){
			console.log(err);
		}else{
			console.log("cursos-> ", cursos);
			res.render("regentes", {cursos: cursos, anoLetivo:req.params.anoLetivo})
		}
	})
})

router.get("/regentes/:ce/:anoLetivo", (req, res) =>{
	let ano = req.params.anoLetivo.replace('_', '/');
	let curso = require('../models/getCurso.js')(req.params.ce, ano, (err, curso) =>{
		if(err){
			console.log(err);
		}else{
			let docente = require('../models/getDocente.js')(curso[0].idCurso,(err, docente) =>{
				if(err){
					console.log(err);
				}else{
					let listaDoc = require('../models/getListaDocs.js')(curso[0].ies, (err, listaDoc) =>{
						if(err){
							console.log(err);
						}else{
							if (curso && curso.length > 0) {
								// Limpa quebras de linha e espaços extras da string
								curso[0].Login = curso[0].Login.replace(/[\r\n]+/g, '').trim();
							}
							console.log("curso- ", curso)
							res.render("regentesCurso", {curso:curso, docentes:docente, role:req.session.role, listaDoc:listaDoc, anoLetivo:ano})
						}
					})
				}
			})
		}
	})	
})

router.get("/delFucsAno", isLoggedIn, (req, res) =>{
	res.render("delFucAno");
})

router.get("/delFucs/:anoLetivo", isLoggedIn, (req, res) => {
	let ano = req.params.anoLetivo.replace('_', '/');
	if(req.session.role=== 'gestor' || req.session.role ==="administrador"){
		let cursos = require("../models/cursosDelFucs.js")("",ano, (err, cursos) =>{
			if(err)
				console.log(err);
			else
				res.render("delFucs", {cursos:cursos, ano:ano})
		})
	}else{
		res.redirect("https://fucs.uatlantica.pt");
	}
	
})

router.get("/getUC/:ce", isLoggedIn, (req, res) =>{
	let lstUcs = require("../models/getUCbyCEDelFucs.js")(req.params.ce, (err,lstUcs) =>{
		if(err)
			console.log(err);
		else
			res.send(lstUcs);
	})
})

router.get("/getFucDel/:id", isLoggedIn, (req, res) => {
	let fuc = require("../models/getFucbyIdDelFucs.js")(req.params.id, (err, fuc) =>{
		if(err)
			console.log(err);
		else{
			res.send(fuc);
		}
			
	})
})

router.get("/relCurso/:idCe/:anoLetivo", isLoggedIn, (req, res) => {
	let anoLetivo = req.params.anoLetivo.replace('_', '/')
	let ce = require("../models/getRelCE.js")(req.params.idCe, anoLetivo, (err, ce) => {
		if(err) {
			console.log(err);
			return res.status(500).send('Erro ao carregar o relatório.');
		}
		// CORREÇÃO: se não houver registo para este idCe/anoLetivo, ce[0] no EJS
		// (ex: ce[0].CE) rebenta com "Cannot read properties of undefined".
		if(!ce || !ce[0]) {
			return res.status(404).send('Relatório não encontrado.');
		}
		let fuc = require("../models/getFucsByyear.js")(req.params.idCe, anoLetivo, (err, fucs) =>{
			if(err){
				console.log(err);
				return res.status(500).send('Erro ao carregar as UCs.');
			}
			let dadosFuc = require("../models/getDadosFucsByYear.js")(req.params.idCe, anoLetivo, (err, dados) => {
				if(err){
					console.log(err)
					return res.status(500).send('Erro ao carregar os dados das UCs.');
				}
				let drop = require("../models/getDropCEByYear.js")(req.params.idCe, anoLetivo, (err, drops) => {
					if(err){
						console.log(err)
						return res.status(500).send('Erro ao carregar os dados de abandono.');
					}
					console.log(dados)
					res.render("relCurso", {ce:ce, fucs:fucs, dados:dados || [], drops:drops || [], idCe:req.params.idCe, anoLetivo:anoLetivo});
				})
			})
		})
	})
})


router.get("/relUc/:idUc/:anoLetivo", isLoggedIn, (req, res) =>{
	let uc=require("../models/getFucbyId.js")(req.params.idUc, (err, uc) =>{
		if(err){
			console.log(err);
		}else{
			let relUC=require("../models/getRelUC.js")(uc[0].nomeUCPt, uc[0].nomeCE, req.params.anoLetivo.replace('_', '-'), (err, relUC)=>{
				if(err){
					console.log(err);
				}else{
					console.log("UC -> ", uc)
					res.render("reluc", {uc:uc, relUC:relUC, anoLetivo:req.params.anoLetivo});
				}
			})
		}
	})
	
})

router.get("/pdfRelUc/:idUc/:nomeUCPt/:anoLetivo/:nomeCE", isLoggedIn, (req, res) =>{

	let relUC=require("../models/getRelUC.js")(req.params.nomeUCPt, req.params.nomeCE, req.params.anoLetivo, (err, relUC)=>{
		if(err){
			console.log(err);
		}else{
			console.log('Rel UC ',relUC)
			if(!relUC[0]){
				let uc=require("../models/getFucbyId.js")(req.params.idUc, (err, uc) =>{
					if(err){
						console.log(err);
					}else{
						let relUC=require("../models/getRelUC.js")(req.params.nomeUCPt, req.params.nomeCE, req.params.anoLetivo, (err, relUC)=>{
							if(err){
								console.log(err);
							}else{
								res.locals.error ="É necessário gravar primeiro o relatório";
								return res.render("reluc", {uc:uc, relUC:relUC, anoLetivo:req.params.anoLetivo});
							}
						})
					}
				})
			} else if(relUC[0].estudC != (relUC[0].nota10+relUC[0].nota11+relUC[0].nota12+relUC[0].nota13+relUC[0].nota14+relUC[0].nota15+relUC[0].nota16+relUC[0].nota17+relUC[0].nota18+relUC[0].nota19+relUC[0].nota20 )){
				console.log(relUC[0].nota10+relUC[0].nota11+relUC[0].nota12+relUC[0].nota13+relUC[0].nota14+relUC[0].nota15+relUC[0].nota16+relUC[0].nota17+relUC[0].nota18+relUC[0].nota19+relUC[0].nota20 )
				let uc=require("../models/getFucbyId.js")(req.params.idUc, (err, uc) =>{
					if(err){
						console.log(err);
					}else{
						let relUC=require("../models/getRelUC.js")(req.params.nomeUCPt, req.params.nomeCE, req.params.anoLetivo, (err, relUC)=>{
							if(err){
								console.log(err);
							}else{
								res.locals.error ="A soma dos alunos com notas iguais ou superiores a 10 deve ser igual ao número total de estudantes aprovados";
								return res.render("reluc", {uc:uc, relUC:relUC, anoLetivo:req.params.anoLetivo});
							}
						})
					}
				})
			}
			else
				res.render("relucPDF", {relUC:relUC});
		}	
	})
})

router.post("/sendUc",isLoggedIn, (req, res) => {
	let nomeUc = removeChar("'","´", req.body.ptTitle);
	let nomeUcEng = removeChar("'","´", req.body.enTitle);
	let nomeCe = removeChar("'","´",req.body.cursoExt);
	let codUc = req.body.codUc;
	let areaCient = removeChar("'","´",  req.body.sigla);
	let ano = removeChar("'","´", req.body.ano);
	let semestre = removeChar("'", "´", req.body.semestre);
	let caracter = removeChar("'","´", req.body.caracter);
	let duracao = removeChar("'","´", req.body.duracao);
	let horasTrab = req.body.horasTrab;
	let horasCont = req.body.horasCont;
	let ects = req.body.ects;
	let hrsT = req.body.hrsT;
	let hrsAssT = req.body.hrsAssT;
	let hrsSincT = req.body.hrsSincT;
	let hrsTp = req.body.hrsTp;
	let hrsAssTp = req.body.hrsAssTp;
	let hrsSincTp = req.body.hrsSincTp;
	let hrsPl = req.body.hrsPl;
	let hrsAssPl = req.body.hrsAssPl;
	let hrsSincPl = req.body.hrsSincPl;
	let hrsTc = req.body.hrsTc;
	let hrsAssTc = req.body.hrsAssTc;
	let hrsSincTc = req.body.hrsSincTc;
	let hrsS = req.body.hrsS;
	let hrsAssS = req.body.hrsAssS;
	let hrsSincS = req.body.hrsSincS;
	let hrsE = req.body.hrsE;
	let hrsAssE = req.body.hrsAssE;
	let hrsSincE = req.body.hrsSincE;
	let hrsOt = req.body.hrsOt;
	let hrsAssOt = req.body.hrsAssOt;
	let hrsSincOt = req.body.hrsSincOt;
	let hrsO = req.body.hrsO;
	let hrsAssO = req.body.hrsAssO;
	let hrsSincO = req.body.hrsSincO;
	let hrsTot = req.body.hrsTot;
	let hrsAssTot = req.body.hrsAssTot;
	let hrsSincTot = req.body.hrsSincTot;
	let hrsPres = req.body.hrsPres;
	let hrsDist = req.body.hrsDist;
	let nomeResp = removeChar("'","´", req.body.nomeResp);
	let grauResp = removeChar("'","´", req.body.grauResp);
	let catResp = removeChar("'","´",  req.body.catResp);
	let cargaResp = removeChar("'", "´", req.body.cargaResp);
	let nomeDoc1 = removeChar("'","'",  req.body.nomeDoc1);
	let grauDoc1 = removeChar("'","´", req.body.grauDoc1);
	let catDoc1 = removeChar("'","´", req.body.catDoc1);
	let cargaDoc1 = removeChar("'","´", req.body.cargaDoc1);
	let nomeDoc2 = removeChar("'","´", req.body.nomeDoc2);
	let grauDoc2 = removeChar("'","´", req.body.grauDoc2);
	let catDoc2 = removeChar("'","´",req.body.catDoc2);
	let cargaDoc2 = removeChar("'","´",req.body.cargaDoc2);
	
	let objetivos = removeChar("'","´", req.body.objetivos);
	let objetivosEn = removeChar("'","´", req.body.objetivosEn);
	let conteudos = removeChar("'","´", req.body.conteudos);
	let conteudosEn = removeChar("'","´", req.body.conteudosEn);
	let demoCont = removeChar("'","´", req.body.demoCont);
	let demoContEn = removeChar("'","´", req.body.demoContEn);
	let metod = removeChar("'","´", req.body.metod);
	let metodEn = removeChar("'","´", req.body.metodEn);
	let aval = removeChar("'","´", req.body.aval);
	let avalEn = removeChar("'","´", req.body.avalEn);
	let demoCoer = removeChar("'","´", req.body.demoCoer);
	let demoCoerEn = removeChar("'","´", req.body.demoCoerEn);
	let biblio = removeChar("'","´", req.body.biblio1);
	let biblio2 = removeChar("'","´", req.body.biblio2);
	let biblio3 = removeChar("'","´", req.body.biblio3);
	let biblio4 = removeChar("'","´", req.body.biblio4);
	let biblio5 = removeChar("'","´", req.body.biblio5);
	biblio.startsWith("1/ ")? biblio =  biblio : biblio = "1/ " + biblio;
	biblio2.startsWith("2/ ")? biblio2 = biblio2 : biblio2 = "2/ " + biblio2;
	biblio3.startsWith("3/ ")? biblio3 = biblio3 : biblio3 = "3/ " + biblio3;
	biblio4.startsWith("4/ ")? biblio4 = biblio4 : biblio4 = "4/ " + biblio4;
	biblio5.startsWith("5/ ")? biblio5 =biblio5 : biblio5 = "5/ " + biblio5;
	let obs = removeChar("'","´", req.body.obs);
	let obsEn = removeChar("'","´", req.body.obsEn);
	let odsLst = [];

	if(req.body.ods1)odsLst.push(1);
	if(req.body.ods2)odsLst.push(2);
	if(req.body.ods3)odsLst.push(3);
	if(req.body.ods4)odsLst.push(4);
	if(req.body.ods5)odsLst.push(5);
	if(req.body.ods6)odsLst.push(6);
	if(req.body.ods7)odsLst.push(7);
	if(req.body.ods8)odsLst.push(8);
	if(req.body.ods9)odsLst.push(9);
	if(req.body.ods10)odsLst.push(10);
	if(req.body.ods11)odsLst.push(11);
	if(req.body.ods12)odsLst.push(12);
	if(req.body.ods13)odsLst.push(13);
	if(req.body.ods14)odsLst.push(14);
	if(req.body.ods15)odsLst.push(15);
	if(req.body.ods16)odsLst.push(16);
	if(req.body.ods17)odsLst.push(17);
	
	let docRespFuc = removeChar("'","´", req.body.respFuc);
	let coordCe = removeChar("'","´", req.body.coordCEResp);
	let anoLetivoFuc = req.body.anoLetivo;
	let dtaRevFuc = removeChar("'","´", req.body.dataRev);
	let dtaCongFuc = Date.now();

	let ceSigla = req.body.nomeCe;

	console.log(odsLst)
	var sql = require("../models/db.js")
	console.log(req.body.anoLetivoFuc);
	console.log(typeof req.body.anoLetivoFuc);
	console.log(Array.isArray(req.body.anoLetivoFuc));
	var fuc = require("../models/fucs.js")( nomeUc, nomeUcEng, nomeCe, areaCient, ano, semestre, caracter, duracao, horasTrab, horasCont, ects, hrsT, hrsAssT, hrsSincT, hrsTp, hrsAssTp, hrsSincTp, hrsPl, hrsAssPl, hrsSincPl, hrsTc, hrsAssTc, hrsSincTc, hrsS, hrsAssS, hrsSincS, hrsE, hrsAssE, hrsSincE, hrsOt, hrsAssOt, hrsSincOt,hrsO, hrsAssO, hrsSincO, hrsTot, hrsAssTot, hrsSincTot, hrsPres, hrsDist, nomeResp, grauResp, catResp, cargaResp, nomeDoc1, grauDoc1, catDoc1, cargaDoc1,nomeDoc2, grauDoc2, catDoc2, cargaDoc2,objetivos, objetivosEn, conteudos, conteudosEn, demoCont, demoContEn, metod, metodEn, aval, avalEn, demoCoer, demoCoerEn,	biblio,biblio2,biblio3,biblio4,biblio5, obs, obsEn, odsLst.toString(),ceSigla, docRespFuc, coordCe, anoLetivoFuc, dtaRevFuc, function(err, fuc){
			if(err){
				console.log(err);
			}else{
				let cursos = require("../models/cursos3.js")(null, (err, cursos) =>{
					if(err){
						console.log(err);
					}else{
						res.locals.success = "Enviado";	
						res.render("landing", {cursos:cursos});
					}
				});
			}
		})
})

router.post('/editaUc', (req, res) => {
	const EditFuc = require('../models/Editfucs'); 
    const b = req.body;
 
    // Validação mínima
    if (!b.codFuc) {
        return res.status(400).send('codFuc em falta.');
    }
 
    // Normaliza campos vazios para não quebrar o CALL (a proc pode não aceitar undefined)
    const v = (val) => (val === undefined || val === null ? '' : val);
 

	// Data/hora atual no formato dd/mm/aaaa hh:mm (hora de Lisboa).
    // Nota: assumi "hh:mm" (horas:minutos) por ser o formato PT habitual —
    // se era mesmo para ser horas:segundos, troca 'minute' por 'second' abaixo.
    function dataAtualFormatada() {
        const partes = new Intl.DateTimeFormat('pt-PT', {
            timeZone: 'Europe/Lisbon',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).formatToParts(new Date());
 
        const get = (tipo) => partes.find(p => p.type === tipo).value;
 
        return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
    }


    EditFuc(
        v(b.codFuc), v(b.ptTitle), v(b.enTitle), v(b.nomeCe), v(b.sigla), v(b.ano),
        v(b.semestre), v(b.caracter), v(b.duracao), v(b.horasTrab), v(b.horasCont), v(b.ects),
 
        v(b.hrsT), v(b.hrsAssT), v(b.hrsSincT),
        v(b.hrsTp), v(b.hrsAssTp), v(b.hrsSincTp),
        v(b.hrsPl), v(b.hrsAssPl), v(b.hrsSincPl),
        v(b.hrsTc), v(b.hrsAssTc), v(b.hrsSincTc),
        v(b.hrsS), v(b.hrsAssS), v(b.hrsSincS),
        v(b.hrsE), v(b.hrsAssE), v(b.hrsSincE),
        v(b.hrsOt), v(b.hrsAssOt), v(b.hrsSincOt),
        v(b.hrsO), v(b.hrsAssO), v(b.hrsSincO),
        v(b.hrsTot), v(b.hrsAssTot), v(b.hrsSincTot),
        v(b.hrsPres), v(b.hrsDist),
 
        v(b.nomeResp), v(b.grauResp), v(b.catResp), v(b.cargaResp),
        v(b.nomeDoc1), v(b.grauDoc1), v(b.catDoc1), v(b.cargaDoc1),
        v(b.nomeDoc2), v(b.grauDoc2), v(b.catDoc2), v(b.cargaDoc2),
        v(b.nomeDoc3), v(b.grauDoc3), v(b.catDoc3), v(b.cargaDoc3),
        v(b.nomeDoc4), v(b.grauDoc4), v(b.catDoc4), v(b.cargaDoc4),
        v(b.nomeDoc5), v(b.grauDoc5), v(b.catDoc5), v(b.cargaDoc5),
        v(b.nomeDoc6), v(b.grauDoc6), v(b.catDoc6), v(b.cargaDoc6),
        v(b.nomeDoc7), v(b.grauDoc7), v(b.catDoc7), v(b.cargaDoc7),
        v(b.nomeDoc8), v(b.grauDoc8), v(b.catDoc8), v(b.cargaDoc8),
        v(b.nomeDoc9), v(b.grauDoc9), v(b.catDoc9), v(b.cargaDoc9),
 
        v(b.objetivos), v(b.objetivosEn), v(b.conteudos), v(b.conteudosEn),
        v(b.demoCont), v(b.demoContEn), v(b.metod), v(b.metodEn),
        v(b.aval), v(b.avalEn), v(b.demoCoer), v(b.demoCoerEn),
 
        v(b.biblio1), v(b.biblio2), v(b.biblio3), v(b.biblio4), v(b.biblio5),
        v(b.obs), v(b.obsEn),
 
        '', // odsLst — os checkboxes ODS estão comentados no formulário; enviar lista vazia
        v(b.ceSigla),
        v(b.respFuc), v(b.coordCEResp), v(b.anoLetivo), dataAtualFormatada(), v(b.dataValid),
 
        (err, result) => {
            if (err) {
                console.error('Erro ao gravar FUC:', err);
                return res.status(500).send('Erro ao gravar a FUC.');
            }
            // Ajusta o redirecionamento ao fluxo real da aplicação
            res.redirect('/getFuc/' + b.codFuc + '?ok=1');
        }
    );
});
		
router.post('/setRegentes/:idCurso', (req, res) => {

    console.log("ID Curso: ", req.params.idCurso);

    Object.entries(req.body).forEach(([idUC, value]) => {
		if (idUC === 'docente') {
			return;
		}

        if (value instanceof Array) {

            console.log(
                "editavel-> ",
                idUC,
                value[0],
                value[1],
                value[2],
                value[3],
                value[4]
            );

            let uc = require('../models/setUC.js')(
                idUC,
                value[0],
                value[1],
                value[2],
                value[3],
                value[4],
                (err, uc) => {

                    if (err) {
                        console.log(err);
                    }

                }
            );
        }
    });

    // ============================
    // COORDENADORES DO CURSO
    // ============================

    let login = "";
	let nome = "";

	if (req.body.tbCoordCurso) {
		if (Array.isArray(req.body.tbCoordCurso)) {
			login = req.body.tbCoordCurso.join(";");
		} else {
			login = req.body.tbCoordCurso;
		}
	}

	if (req.body.tbNomeCoord) {
		nome = req.body.tbNomeCoord;
	}

	console.log("LOGIN COORDENADORES:", login);
	console.log("NOME COORDENADORES:", nome);

    let ce = require('../models/setCurso.js')(
        req.params.idCurso,
        login,
        nome,
        (err, ce) => {

            if (err) {
                console.log(err);
            } else {
                res.redirect("/regentesAno");
            }

        }
    );
});

router.post('/delFuc/:id', (req, res) =>{
	let ficheiro = require('../models/delFuc.js')(req.params.id, (err, ficheiro) =>{
		if(err){
			console.log(err);
		}else{
			res.render("menu")
		}
	})
})

router.post('/relCurso/setRelCE', (req, res) =>{
	let codCe = removeChar("'","´", req.body.idCe);
	let anoLetivo = removeChar("'","´", req.body.anoLetivo);
	let platInquerit = removeChar("'","´", req.body.tbPlataSurvey);
	let nrIscrit = removeChar("'","´", req.body.tbNrInscri);
	let nrIscritUC = 0;
	nrIscritUC = removeChar("'","´", req.body.tbNrInscriUC);
	
	let nrRespost1Sem = removeChar("'","´", req.body.tbNrResp1Sem);
	let perResp1Sem = removeChar("'","´", req.body.tbPerResp1Sem);
	let nrRespost2Sem = removeChar("'","´", req.body.tbNrResp2Sem);
	let perResp2Sem = removeChar("'","´", req.body.tbPerResp2Sem);
	let clarezaUC = removeChar("'","´", req.body.tbAvgClareza);
	let grauInteresse = removeChar("'","´", req.body.tbAvgGrauInt);
	let articOutUC = removeChar("'","´", req.body.tbArticUC);
	let grauDificul = removeChar("'","´", req.body.tbAvgGrauDific);
	let relConteudo = removeChar("'","´", req.body.tbRelCargaConte);
	let articulAulas = removeChar("'","´", req.body.tbRelTeoPrat);
	let dispBiblio = removeChar("'","´", req.body.tbBiblioDisp);
	let claroElemAval = removeChar("'","´", req.body.tbElemAval);
	let DispMeios = removeChar("'","´", req.body.tbDispMeios);
	let ArticulRealid = removeChar("'","´", req.body.tbUCMundoReal);
	let media = removeChar("'","´", req.body.tbAvgGreal);

	let NrIncriUltAno = removeChar("'","´", req.body.tbNrIncriUltAno);
	let NrDiplom = removeChar("'","´", req.body.tbNrDiplom);
	let TxAprov = removeChar("'","´", req.body.tbTxAprov);
	let graduados3anos = removeChar("'","´", req.body.tbNrGrad_ano3);
	let graduados2anos = removeChar("'","´", req.body.tbNrGrad_ano2);
	let graduados1ano = removeChar("'","´", req.body.tbNrGrad_ano1);
	let graduadosNAnos3anos = removeChar("'","´", req.body.tbNrGradNAnos_ano3);
	let graduadosNAnos2anos = removeChar("'","´", req.body.tbNrGradNAnos_ano2);
	let graduadosNAnos1anos = removeChar("'","´", req.body.tbNrGradNAnos_ano1);
	let graduadosN1Anos3anos = removeChar("'","´", req.body.tbNrGradN1Anos_ano3);
	let graduadosN1Anos2anos = removeChar("'","´", req.body.tbNrGradN1Anos_ano2);
	let graduadosN1Anos1anos = removeChar("'","´", req.body.tbNrGradN1Anos_ano1);
	let graduadosN2Anos3anos = removeChar("'","´", req.body.tbNrGradN2Anos_ano3);
	let graduadosN2Anos2anos = removeChar("'","´", req.body.tbNrGradN2Anos_ano2);
	let graduadosN2Anos1anos = removeChar("'","´", req.body.tbNrGradN2Anos_ano1);
	let graduadosN2MAnos3anos = removeChar("'","´", req.body.tbNrGradN2MAnos_ano3);
	let graduadosN2MAnos2anos = removeChar("'","´", req.body.tbNrGradN2MAnos_ano2);
	let graduadosN2MAnos1anos = removeChar("'","´", req.body.tbNrGradN2MAnos_ano1);

	let estudEstragAnt = removeChar("'","´", req.body.estudEstragAnt);
	let estudEstragPen = removeChar("'","´", req.body.estudEstragPen);
	let estudEstragUlt = removeChar("'","´", req.body.estudEstragUlt);
	let estudMobInAnt = removeChar("'","´", req.body.estudMobInAnt);
	let estudMobInPen = removeChar("'","´", req.body.estudMobInPen);
	let estudMobInUlt = removeChar("'","´", req.body.estudMobInUlt);
	let estudMobOutAnt = removeChar("'","´", req.body.estudMobOutAnt);
	let estudMobOutPen = removeChar("'","´", req.body.estudMobOutPen);
	let estudMobOutUlt = removeChar("'","´", req.body.estudMobOutUlt);
	let estudDocInAnt = removeChar("'","´", req.body.estudDocInAnt);
	let estudDocInPen = removeChar("'","´", req.body.estudDocInPen);
	let estudDocInUlt = removeChar("'","´", req.body.estudDocInUlt);
	let estudDocOutAnt = removeChar("'","´", req.body.estudDocOutAnt);
	let estudDocOutPen = removeChar("'","´", req.body.estudDocOutPen);
	let estudDocOutUlt = removeChar("'","´", req.body.estudDocOutUlt);
	let estudStaffInAnt = removeChar("'","´", req.body.estudStaffInAnt);
	let estudStaffInPen = removeChar("'","´", req.body.estudStaffInPen);
	let estudStaffInUlt = removeChar("'","´", req.body.estudStaffInUlt);
	let estudStaffOutAnt = removeChar("'","´", req.body.estudStaffOutAnt);
	let estudStaffOutPen = removeChar("'","´", req.body.estudStaffOutPen);
	let estudStaffOutUlt = removeChar("'","´", req.body.estudStaffOutUlt);
	let tbIntRev = removeChar("'","´", req.body.tbIntRev);

	let wosq1 = removeChar("'","´", req.body.wosq1);
	let wosq2 = removeChar("'","´", req.body.wosq2);
	let wosq3 = removeChar("'","´", req.body.wosq3);
	let wosq4 = removeChar("'","´", req.body.wosq4);
	let wosn = removeChar("'","´", req.body.wosn);
	let elsq1 = removeChar("'","´", req.body.elsq1);
	let elsq2 = removeChar("'","´", req.body.elsq2);
	let elsq3 = removeChar("'","´", req.body.elsq3);
	let elsq4 = removeChar("'","´", req.body.elsq4);
	let elsn = removeChar("'","´", req.body.elsn);
	let sjrq1 = removeChar("'","´", req.body.sjrq1);
	let sjrq2 = removeChar("'","´", req.body.sjrq2);
	let sjrq3 = removeChar("'","´", req.body.sjrq3);
	let sjrq4 = removeChar("'","´", req.body.sjrq4);
	let sjrn = removeChar("'","´", req.body.sjrn);
	let outn = removeChar("'","´", req.body.outn);
	let pubTot = removeChar("'","´", req.body.pubTot);
	let lbRevCient = removeChar("'","´", req.body.lbRevCient);
	let lbLivro = removeChar("'","´", req.body.lbLivro);
	let lbAtas = removeChar("'","´", req.body.lbAtas);
	let lbOutPub = removeChar("'","´", req.body.lbOutPub);


	let ativComunidade = removeChar("'","´", req.body.tbArtiComu);
	let ativInvestig = removeChar("'","´", req.body.tbIvest);
	let pontosFortes = removeChar("'","´", req.body.tbPontosFortes);
	let acoesFormac = removeChar("'","´", req.body.tbFormCompl);
	// CORREÇÃO: estava a ler req.body.tbFormCompl (o mesmo campo de "acoesFormac"),
	// por isso "Sugestões de Melhoria" nunca era gravado com o próprio conteúdo —
	// ficava sempre igual a "Ações de Formação Complementar". O campo certo no
	// formulário é tbSugestMelhor.
	let sugestMelhoria = removeChar("'","´", req.body.tbSugestMelhor);
	let considFinais = removeChar("'","´", req.body.tbConsidFinal);

	let dtaSophUC = removeChar("'","´", req.body.tbDtaSophUC);
	let dtaSophInscri = removeChar("'","´", req.body.tbDtaSophInscri);
	let dtaSophDiplom = removeChar("'","´", req.body.tbDtaSophDiplom);
	let dtaSophInter = removeChar("'","´", req.body.tbDtaSophInter);
	
	let tbNrAband_1ano = removeChar("'","´", req.body.tbNrAband_1ano);
	let tbNrAband_2ano = removeChar("'","´", req.body.tbNrAband_2ano);
	let tbNrAband_3ano = "";
	if(req.body.tbNrAband_3ano)
		tbNrAband_3ano = removeChar("'","´", req.body.tbNrAband_3ano);
	let tbNrAband_4ano = "";
	if(req.body.tbNrAband_4ano)
		tbNrAband_4ano = removeChar("'","´", req.body.tbNrAband_4ano);
	let tbNrAband_5ano = "";
	if(req.body.tbNrAband_5ano)
		tbNrAband_5ano = removeChar("'","´", req.body.tbNrAband_5ano);
	let tbNrAnul_1ano = removeChar("'","´", req.body.tbNrAnul_1ano);
	let tbNrAnul_2ano = removeChar("'","´", req.body.tbNrAnul_2ano);
	let tbNrAnul_3ano = "";
	if(req.body.tbNrAnul_3ano)
		tbNrAnul_3ano = removeChar("'","´", req.body.tbNrAnul_3ano);
	let tbNrAnul_4ano = "";
	if(req.body.tbNrAnul_4ano)
		tbNrAnul_4ano = removeChar("'","´", req.body.tbNrAnul_4ano);
	let tbNrAnul_5ano = "";
	if(req.body.tbNrAnul_5ano)
		tbNrAnul_5ano = removeChar("'","´", req.body.tbNrAnul_5ano);

	Object.entries(req.body).forEach(([idfucs, value]) => {
		if(value instanceof Array){
			if(!value[0]) value[0] = 0;
			if(!value[1]) value[1] = 0;
			if(!value[2]) value[2] = 0;
			if(!value[3]) value[3] = 0;
			
			let uc =  require('../models/setFucsRelCE.js')(idfucs,anoLetivo, value[0], value[1], value[2], value[3], (err, uc) =>{
				if(err){
					console.log(err);
				}else{
					console.log(idfucs,anoLetivo, value[0], value[1], value[2], value[3])
				}
			})
		}
	});
	
 	let abandono = require('../models/setAbandonoRelCE.js')(codCe, anoLetivo, tbNrAband_1ano,tbNrAband_2ano, tbNrAband_3ano, tbNrAband_4ano, tbNrAband_5ano, tbNrAnul_1ano, tbNrAnul_2ano, tbNrAnul_3ano, tbNrAnul_4ano, tbNrAnul_5ano, (err, aband) => {
		if(err)
			console.log(err)
		else{
			let rel = require('../models/setRelCe.js')(codCe, anoLetivo, platInquerit, nrIscrit, nrIscritUC, nrRespost1Sem, perResp1Sem, nrRespost2Sem, perResp2Sem, clarezaUC, grauInteresse, articOutUC, grauDificul, relConteudo, articulAulas, dispBiblio, claroElemAval, DispMeios, ArticulRealid, media,NrIncriUltAno, NrDiplom,TxAprov ,graduados3anos, graduados2anos, graduados1ano, graduadosNAnos3anos, graduadosNAnos2anos, graduadosNAnos1anos, graduadosN1Anos3anos, graduadosN1Anos2anos, graduadosN1Anos1anos, graduadosN2Anos3anos, graduadosN2Anos2anos, graduadosN2Anos1anos, graduadosN2MAnos3anos, graduadosN2MAnos2anos, graduadosN2MAnos1anos, ativComunidade, ativInvestig, pontosFortes, acoesFormac, sugestMelhoria, considFinais, dtaSophUC, dtaSophInscri, dtaSophDiplom, dtaSophInter, estudEstragAnt, estudEstragPen, estudEstragUlt, estudMobInAnt, estudMobInPen, estudMobInUlt, estudMobOutAnt, estudMobOutPen, estudMobOutUlt, estudDocInAnt, estudDocInPen, estudDocInUlt, estudDocOutAnt, estudDocOutPen, estudDocOutUlt, estudStaffInAnt, estudStaffInPen, estudStaffInUlt, estudStaffOutAnt, estudStaffOutPen, estudStaffOutUlt, tbIntRev, wosq1, wosq2, wosq3, wosq4, wosn, elsq1, elsq2, elsq3, elsq4, elsn, sjrq1, sjrq2, sjrq3, sjrq4, sjrn, outn, pubTot, lbRevCient, lbLivro, lbAtas, lbOutPub, (err, rel) => {
				if(err)
					console.log(err)
				else{
					
					res.locals.success = "Enviado";	
					res.redirect("https://fucs.uatlantica.pt/");
				}
			})
		}
	})

	let finalizado = 0;

})

router.get('/pdfsendRAC/:codCE', isLoggedIn, (req, res) =>{
	let anoLetivo = '2025/26';
	let codCe = req.params.codCE;
	let ced = require("../models/getRelCE.js")(codCe, anoLetivo, (err, ce) => {
		if(err)console.log(err);
		else{
			let fuc = require("../models/getFucsByyear.js")(codCe, (err, fucs) =>{
				if(err)console.log(err);
				else{
					let dadosFuc = require("../models/getDadosFucsByYear.js")(codCe, anoLetivo, (err, dados) => {
						if(err)console.log(err);
						else{
							let drop = require("../models/getDropCEByYear.js")(codCe, anoLetivo, (err, drops) => {
								if(err)console.log(err);
								else{
									sendRacNotif(codCe, anoLetivo, dados, ce, fucs, drops);
									res.locals.success = "Enviado";	
									res.redirect("https://fucs.uatlantica.pt/");
								}
							})
						}
					})
				}
			})
		}
	})
})

router.get('/pdfSendRUC/:codRUC', isLoggedIn, (req, res) => {
	let relUC = require("../models/getRelUCById.js")(req.params.codRUC, (err, relUC) => {
		if(err)console.log(err);
		else{
			if (relUC && relUC.length > 0) {
				if (relUC[0].comentarios && relUC[0].comentarios.length > 0) {
					sendRucNotif(relUC);
					res.locals.success = "Enviado";	
					res.redirect("https://fucs.uatlantica.pt/");
				}else{
					let rel=require("../models/getRelUC.js")(relUC[0].uc, relUC[0].ce, relUC[0].anoLetivo, (err, relUC)=>{
						if(err){
							console.log(err);
						}else{
							res.locals.error = "Deve colocar um texto no campo comentários";
							return res.render("reluc", {uc:relUC[0].uc, relUC:relUC, anoLetivo:relUC[0].anoLetivo});
						}
					})

				}
			}
			else{
				let rel=require("../models/getRelUC.js")(relUC[0].uc, relUC[0].ce, relUC[0].anoLetivo, (err, relUC)=>{
					if(err){
						console.log(err);
					}else{
						res.locals.error = "Deve colocar um texto no campo comentários";
						return res.render("reluc", {uc:relUC[0].uc, relUC:relUC, anoLetivo:relUC[0].anoLetivo});
					}
				})

			}
		}
	})
	
})

router.post('/reluc/setRelUC', (req, res) =>{
	let idCE = removeChar("'","´", req.body.idCe);
	let idRelUC = removeChar("'","´", req.body.idrelUC);
	let anoLetivo = removeChar("'","´", req.body.anoLetivo);
	let docenteResp = removeChar("'","´", req.body.nomeDocente);
	let hrsContDocResp = req.body.nrHorasCOntato ? req.body.nrHorasCOntato : 0;
	let uc = removeChar("'","´", req.body.nomeUC);
	let obs = removeChar("'","´", req.body.obs);
	let ce = removeChar("'","´", req.body.nomeCE);
	let ano = removeChar("'","´", req.body.ano);
	let semestre = removeChar("'","´", req.body.semestre);
	let ects = req.body.ects ? req.body.ects: 0;
	let totHrs = req.body.totHoras ? req.body.totHoras : 0;
	let hrsT = req.body.horasT ? req.body.horasT : 0;
	let hrsTP = req.body.horasTP ? req.body.horasTP : 0;
	let hrsPL = req.body.horasPL ? req.body.horasPL : 0;
	let hrsTC = req.body.horasTC ? req.body.horasTC : 0;
	let hrsS = req.body.horasS ? req.body.horasS : 0;
	let hrsE = req.body.horasE ? req.body.horasE : 0;
	let hrsOT = req.body.horasOT ? req.body.horasOT: 0;
	let hrso = req.body.horasO ? req.body.horasO : 0;
	let aulasPrev = req.body.horasTot ? req.body.horasTot : 0;
	let percEaD = req.body.horasEaD ? req.body.horasEaD: 0;
	let nomeDoc1 = removeChar("'","´", req.body.nomeDoc1);
	let nrTurmDoc1 = req.body.nrTurmas1 ? req.body.nrTurmas1 : 0;
	let doc1T = req.body.horasTdoc1 ? req.body.horasTdoc1 : 0;
	let doc1TP = req.body.horasTPdoc1 ? req.body.horasTPdoc1 : 0;
	let doc1PL = req.body.horasPLdoc1 ? req.body.horasPLdoc1 : 0;
	let doc1TC = req.body.horasTCdoc1 ? req.body.horasTCdoc1 : 0;
	let doc1S = req.body.horasSdoc1 ? req.body.horasSdoc1 : 0;
	let doc1E = req.body.horasEdoc1 ? req.body.horasEdoc1 : 0;
	let doc1OT = req.body.horasOTdoc1 ? req.body.horasOTdoc1 : 0;
	let doc1O = req.body.horasOdoc1 ? req.body.horasOdoc1 : 0;
	let doc1AulasPrev = req.body.aulasPrev1 ? req.body.aulasPrev1 : 0;
	let doc1AulasLec = req.body.aulasLecio1 ? req.body.aulasLecio1 : 0;
	let doc1PrecAulas = req.body.percAulasDadas1 ? req.body.percAulasDadas1 : 0;
	let nomeDoc2 = removeChar("'","´", req.body.nomeDoc2);
	let nrTurmDoc2 = req.body.nrTurmas2 ? req.body.nrTurmas2 : 0;
	let doc2T = req.body.horasTdoc2 ? req.body.horasTdoc2 : 0;
	let doc2TP = req.body.horasTPdoc2 ? req.body.horasTPdoc2 : 0;
	let doc2PL = req.body.horasPLdoc2 ? req.body.horasPLdoc2 : 0;
	let doc2TC = req.body.horasTCdoc2 ? req.body.horasTCdoc2 : 0;
	let doc2S = req.body.horasSdoc2 ? req.body.horasSdoc2 : 0;
	let doc2E = req.body.horasEdoc2 ? req.body.horasEdoc2 : 0;
	let doc2OT = req.body.horasOTdoc2 ? req.body.horasOTdoc2 : 0;
	let doc2O = req.body.horasOdoc2 ? req.body.horasOdoc2 : 0;
	let doc2AulasPrev = req.body.aulasPrev2 ? req.body.aulasPrev2 : 0;
	let doc2AulasLec = req.body.aulasLecio2 ? req.body.aulasLecio2 : 0;
	let doc2PrecAulas = req.body.percAulasDadas2 ? req.body.percAulasDadas2 : 0;
	let nomeDoc3 = removeChar("'","´", req.body.nomeDoc3);
	let nrTurmDoc3 = req.body.nrTurmas3 ? req.body.nrTurmas3 : 0;
	let doc3T = req.body.horasTdoc3 ? req.body.horasTdoc3 : 0;
	let doc3TP = req.body.horasTPdoc3 ? req.body.horasTPdoc3 : 0;
	let doc3PL = req.body.horasPLdoc3 ? req.body.horasPLdoc3 : 0;
	let doc3TC = req.body.horasTCdoc3 ? req.body.horasTCdoc3 : 0;
	let doc3S = req.body.horasSdoc3 ? req.body.horasSdoc3 : 0;
	let doc3E = req.body.horasEdoc3 ? req.body.horasEdoc3 : 0;
	let doc3OT = req.body.horasOTdoc3 ? req.body.horasOTdoc3 : 0;
	let doc3O = req.body.horasOdoc3 ? req.body.horasOdoc3 : 0;
	let doc3AulasPrev = req.body.aulasPrev3 ? req.body.aulasPrev3 : 0;
	let doc3AulasLec = req.body.aulasLecio3 ? req.body.aulasLecio3 : 0;
	let doc3PrecAulas = req.body.percAulasDadas3 ? req.body.percAulasDadas3 : 0;
	let nomeDoc4 = removeChar("'","´", req.body.nomeDoc4);
	let nrTurmDoc4 = req.body.nrTurmas4 ? req.body.nrTurmas4 : 0;
	let doc4T = req.body.horasTdoc4 ? req.body.horasTdoc4 : 0;
	let doc4TP = req.body.horasTPdoc4 ? req.body.horasTPdoc4 : 0;
	let doc4PL = req.body.horasPLdoc4 ? req.body.horasPLdoc4 : 0;
	let doc4TC = req.body.horasTCdoc4 ? req.body.horasTCdoc4 : 0;
	let doc4S = req.body.horasSdoc4 ? req.body.horasSdoc4 : 0;
	let doc4E = req.body.horasEdoc4 ? req.body.horasEdoc4 : 0;
	let doc4OT = req.body.horasOTdoc4 ? req.body.horasOTdoc4 : 0;
	let doc4O = req.body.horasOdoc4 ? req.body.horasOdoc4 : 0;
	let doc4AulasPrev = req.body.aulasPrev4 ? req.body.aulasPrev4 : 0;
	let doc4AulasLec = req.body.aulasLecio4 ? req.body.aulasLecio4 : 0;
	let doc4PrecAulas = req.body.percAulasDadas4 ? req.body.percAulasDadas4 : 0;
	let nomeDoc5 = removeChar("'","´", req.body.nomeDoc5);
	let nrTurmDoc5 = req.body.nrTurmas5 ? req.body.nrTurmas5 : 0;
	let doc5T = req.body.horasTdoc5 ? req.body.horasTdoc5 : 0;
	let doc5TP = req.body.horasTPdoc5 ? req.body.horasTPdoc5 : 0;
	let doc5PL = req.body.horasPLdoc5 ? req.body.horasPLdoc5 : 0;
	let doc5TC = req.body.horasTCdoc5 ? req.body.horasTCdoc5 : 0;
	let doc5S = req.body.horasSdoc5 ? req.body.horasSdoc5 : 0;
	let doc5E = req.body.horasEdoc5 ? req.body.horasEdoc5 : 0;
	let doc5OT = req.body.horasOTdoc5 ? req.body.horasOTdoc5 : 0;
	let doc5O = req.body.horasOdoc5 ? req.body.horasOdoc5 : 0;
	let doc5AulasPrev = req.body.aulasPrev5 ? req.body.aulasPrev5 : 0;
	let doc5AulasLec = req.body.aulasLecio5 ? req.body.aulasLecio5 : 0;
	let doc5PrecAulas = req.body.percAulasDadas5 ? req.body.percAulasDadas5 : 0;
	let nomeDoc6 = removeChar("'","´", req.body.nomeDoc6);
	let nrTurmDoc6 = req.body.nrTurmas6 ? req.body.nrTurmas6 : 0;
	let doc6T = req.body.horasTdoc6 ? req.body.horasTdoc6 : 0;
	let doc6TP = req.body.horasTPdoc6 ? req.body.horasTPdoc6 : 0;
	let doc6PL = req.body.horasPLdoc6 ? req.body.horasPLdoc6 : 0;
	let doc6TC = req.body.horasTCdoc6 ? req.body.horasTCdoc6 : 0;
	let doc6S = req.body.horasSdoc6 ? req.body.horasSdoc6 : 0;
	let doc6E = req.body.horasEdoc6 ? req.body.horasEdoc6 : 0;
	let doc6OT = req.body.horasOTdoc6 ? req.body.horasOTdoc6 : 0;
	let doc6O = req.body.horasOdoc6 ? req.body.horasOdoc6 : 0;
	let doc6AulasPrev = req.body.aulasPrev6 ? req.body.aulasPrev6 : 0;
	let doc6AulasLec = req.body.aulasLecio6 ? req.body.aulasLecio6 : 0;
	let doc6PrecAulas = req.body.percAulasDadas6 ? req.body.percAulasDadas6 : 0;
	let nomeDoc7 = removeChar("'","´", req.body.nomeDoc7);
	let nrTurmDoc7 = req.body.nrTurmas7 ? req.body.nrTurmas7 : 0;
	let doc7T = req.body.horasTdoc7 ? req.body.horasTdoc7 : 0;
	let doc7TP = req.body.horasTPdoc7 ? req.body.horasTPdoc7 : 0;
	let doc7PL = req.body.horasPLdoc7 ? req.body.horasPLdoc7 : 0;
	let doc7TC = req.body.horasTCdoc7 ? req.body.horasTCdoc7 : 0;
	let doc7S = req.body.horasSdoc7 ? req.body.horasSdoc7 : 0;
	let doc7E = req.body.horasEdoc7 ? req.body.horasEdoc7 : 0;
	let doc7OT = req.body.horasOTdoc7 ? req.body.horasOTdoc7 : 0;
	let doc7O = req.body.horasOdoc7 ? req.body.horasOdoc7 :0;
	let doc7AulasPrev = req.body.aulasPrev7 ? req.body.aulasPrev7 : 0;
	let doc7AulasLec = req.body.aulasLecio7 ? req.body.aulasLecio7 : 0;
	let doc7PrecAulas = req.body.percAulasDadas7 ? req.body.percAulasDadas7 : 0;
	let nomeDoc8 = removeChar("'","´", req.body.nomeDoc8);
	let nrTurmDoc8 = req.body.nrTurmas8 ? req.body.nrTurmas8 : 0;
	let doc8T = req.body.horasTdoc8 ? req.body.horasTdoc8 :0;
	let doc8TP = req.body.horasTPdoc8 ? req.body.horasTPdoc8 : 0;
	let doc8PL = req.body.horasPLdoc8 ? req.body.horasPLdoc8 : 0;
	let doc8TC = req.body.horasTCdoc8 ? req.body.horasTCdoc8 : 0;
	let doc8S = req.body.horasSdoc8 ? req.body.horasSdoc8 : 0;
	let doc8E = req.body.horasEdoc8 ? req.body.horasEdoc8 : 0;
	let doc8OT = req.body.horasOTdoc8 ? req.body.horasOTdoc8 : 0;
	let doc8O = req.body.horasOdoc8 ? req.body.horasOdoc8 : 0;
	let doc8AulasPrev = req.body.aulasPrev8 ? req.body.aulasPrev8 : 0;
	let doc8AulasLec = req.body.aulasLecio8 ? req.body.aulasLecio8 : 0;
	let doc8PrecAulas = req.body.percAulasDadas8 ? req.body.percAulasDadas8 : 0;
	let nomeDoc9 = removeChar("'","´", req.body.nomeDoc9);
	let nrTurmDoc9 = req.body.nrTurmas9 ? req.body.nrTurmas9 : 0;
	let doc9T = req.body.horasTdoc9 ? req.body.horasTdoc9 : 0;
	let doc9TP = req.body.horasTPdoc9 ? req.body.horasTPdoc9 : 0;
	let doc9PL = req.body.horasPLdoc9 ? req.body.horasPLdoc9 : 0;
	let doc9TC = req.body.horasTCdoc9 ? req.body.horasTCdoc9 : 0;
	let doc9S = req.body.horasSdoc9 ? req.body.horasSdoc9 : 0;
	let doc9E = req.body.horasEdoc9 ? req.body.horasEdoc9 : 0;
	let doc9OT = req.body.horasOTdoc9 ? req.body.horasOTdoc9 : 0;
	let doc9O = req.body.horasOdoc9 ? req.body.horasOdoc9 : 0;
	let doc9AulasPrev = req.body.aulasPrev9 ? req.body.aulasPrev9 : 0;
	let doc9AulasLec = req.body.aulasLecio9 ? req.body.aulasLecio9 : 0;
	let doc9PrecAulas = req.body.percAulasDadas9 ? req.body.percAulasDadas9 : 0;
	let nomeDoc10 = removeChar("'","´", req.body.nomeDoc10);
	let nrTurmDoc10 = req.body.nrTurmas10 ? req.body.nrTurmas10 : 0;
	let doc10T = req.body.horasTdoc10 ? req.body.horasTdoc10 : 0;
	let doc10TP = req.body.horasTPdoc10 ? req.body.horasTPdoc10 : 0;
	let doc10PL = req.body.horasPLdoc10 ? req.body.horasPLdoc10 : 0;
	let doc10TC = req.body.horasTCdoc10 ? req.body.horasTCdoc10 : 0;
	let doc10S = req.body.horasSdoc10 ? req.body.horasSdoc10 : 0;
	let doc10E = req.body.horasEdoc10 ? req.body.horasEdoc10 : 0;
	let doc10OT = req.body.horasOTdoc10 ? req.body.horasOTdoc10 : 0;
	let doc10O = req.body.horasOdoc10 ? req.body.horasOdoc10 : 0;
	let doc10AulasPrev = req.body.aulasPrev10 ? req.body.aulasPrev10 : 0;
	let doc10AulasLec = req.body.aulasLecio10 ? req.body.aulasLecio10 : 0;
	let doc10PrecAulas = req.body.percAulasDadas10 ? req.body.percAulasDadas10 : 0;
	let momAvalCont1 = removeChar("'","´", req.body.momAvalCont1);
	let dtaAvalCont1 = removeChar("'","´", req.body.dtaAvalCont1);
	let momAvalCont2 = removeChar("'","´", req.body.momAvalCont2);
	let dtaAvalCont2 = removeChar("'","´", req.body.dtaAvalCont2);
	let momAvalCont3 = removeChar("'","´", req.body.momAvalCont3);
	let dtaAvalCont3 = removeChar("'","´", req.body.dtaAvalCont3);
	let momAvalCont4 = removeChar("'","´", req.body.momAvalCont4);
	let dtaAvalCont4 = removeChar("'","´", req.body.dtaAvalCont4);
	let momAvalCont5 = removeChar("'","´", req.body.momAvalCont5);
	let dtaAvalCont5 = removeChar("'","´", req.body.dtaAvalCont5);
	let momAvalCont6 = removeChar("'","´", req.body.momAvalCont6);
	let dtaAvalCont6 = removeChar("'","´", req.body.dtaAvalCont6);
	let momAvalCont7 = removeChar("'","´", req.body.momAvalCont7);
	let dtaAvalCont7 = removeChar("'","´", req.body.dtaAvalCont7);
	let dtaAvalFimEN = removeChar("'","´", req.body.dtaAvalEpNorm);
	let dtaAvalFimEE = removeChar("'","´", req.body.dtaAvalEpExtra);
	let dtaAvalFimEF = removeChar("'","´", req.body.dtaAvalEpFin);
	let dtaAvalFimET = removeChar("'","´", req.body.dtaAvalEpTrabEst);
	let estudA = req.body.estudA ? req.body.estudA : 0;
	let estudB = req.body.estudB ? req.body.estudB : 0;
	let estudC = req.body.estudC ? req.body.estudC : 0;
	let estudC1 = req.body.estudC1 ? req.body.estudC1 : 0;
	let estudC2 = req.body.estudC2 ? req.body.estudC2 : 0;
	let estudC3 = req.body.estudC3 ? req.body.estudC3 : 0;
	let estudC4 = req.body.estudC4 ? req.body.estudC4 : 0;
	let estudC5 = req.body.estudC5 ? req.body.estudC5 : 0;
	let estudD = req.body.estudD ? req.body.estudD : 0;
	let estudD1 = req.body.estudD1 ? req.body.estudD1 : 0;
	let estudD2 = req.body.estudD2 ? req.body.estudD2 : 0;
	let estudE = 0;
	let estudE1 = req.body.estudE1 ? req.body.estudE1 : 0;
	let estudE2 = req.body.estudE2 ? req.body.estudE2 : 0;
	let estudE3 = req.body.estudE3 ? req.body.estudE3 : 0;
	let comentarios = removeChar("'","´", req.body.comentarios);
	let semestreLetivo = removeChar("'","´", req.body.semestreLetivo);
	let nota10 = req.body.nota10 ? req.body.nota10 : 0;
	let nota11 = req.body.nota11 ? req.body.nota11 : 0;
	let nota12 = req.body.nota12 ? req.body.nota12 : 0;
	let nota13 = req.body.nota13 ? req.body.nota13 : 0;
	let nota14 = req.body.nota14 ? req.body.nota14 : 0;
	let nota15 = req.body.nota15 ? req.body.nota15 : 0;
	let nota16 = req.body.nota16 ? req.body.nota16 : 0;
	let nota17 = req.body.nota17 ? req.body.nota17 : 0;
	let nota18 = req.body.nota18 ? req.body.nota18 : 0;
	let nota19 = req.body.nota19 ? req.body.nota19 : 0;
	let nota20 = req.body.nota20 ? req.body.nota20 : 0;
	
	anoLetivo = anoLetivo.replace('/', '-');

	if(idRelUC == 0){
		//insert
		let rel = require('../models/insRelUC.js')(idCE, anoLetivo, docenteResp, hrsContDocResp, uc, obs, ce, ano, semestre, ects, totHrs, hrsT, hrsTP, hrsPL, hrsTC, hrsS, hrsE, hrsOT, hrso, aulasPrev, percEaD, nomeDoc1,nrTurmDoc1, doc1T,doc1TP ,doc1PL, doc1TC, doc1S, doc1E, doc1OT, doc1O, doc1AulasPrev, doc1AulasLec, doc1PrecAulas, nomeDoc2, nrTurmDoc2, doc2T, doc2TP, doc2PL, doc2TC,doc2S,doc2E, doc2OT, doc2O, doc2AulasPrev, doc2AulasLec, doc2PrecAulas, nomeDoc3, nrTurmDoc3, doc3T, doc3TP, doc3PL, doc3TC, doc3S,doc3E, doc3OT, doc3O, doc3AulasPrev, doc3AulasLec, doc3PrecAulas, nomeDoc4, nrTurmDoc4, doc4T, doc4TP, doc4PL, doc4TC, doc4S,doc4E, doc4OT, doc4O, doc4AulasPrev, doc4AulasLec, doc4PrecAulas, nomeDoc5, nrTurmDoc5, doc5T, doc5TP, doc5PL, doc5TC, doc5S,doc5E, doc5OT, doc5O, doc5AulasPrev, doc5AulasLec, doc5PrecAulas, nomeDoc6, nrTurmDoc6, doc6T, doc6TP, doc6PL, doc6TC, doc6S,doc6E, doc6OT, doc6O, doc6AulasPrev, doc6AulasLec, doc6PrecAulas, nomeDoc7, nrTurmDoc7, doc7T, doc7TP, doc7PL, doc7TC, doc7S,doc7E, doc7OT, doc7O, doc7AulasPrev, doc7AulasLec, doc7PrecAulas, nomeDoc8, nrTurmDoc8, doc8T, doc8TP, doc8PL, doc8TC, doc8S,doc8E, doc8OT, doc8O, doc8AulasPrev, doc8AulasLec, doc8PrecAulas, nomeDoc9, nrTurmDoc9, doc9T, doc9TP, doc9PL, doc9TC, doc9S,doc9E, doc9OT, doc9O, doc9AulasPrev, doc9AulasLec, doc9PrecAulas, nomeDoc10, nrTurmDoc10, doc10T, doc10TP, doc10PL, doc10TC, doc10S,doc10E, doc10OT, doc10O, doc10AulasPrev, doc10AulasLec, doc10PrecAulas, momAvalCont1, dtaAvalCont1, momAvalCont2, dtaAvalCont2, momAvalCont3, dtaAvalCont3, momAvalCont4, dtaAvalCont4, momAvalCont5, dtaAvalCont5, momAvalCont6, dtaAvalCont6, momAvalCont7, dtaAvalCont7, dtaAvalFimEN, dtaAvalFimEE, dtaAvalFimEF, dtaAvalFimET, estudA, estudB, estudC,estudC1,estudC2,estudC3,estudC4,estudC5, estudD, estudD1, estudD2, estudE, estudE1, estudE2, estudE3, comentarios, semestreLetivo, nota10, nota11, nota12, nota13,nota14,nota15, nota16, nota17, nota18, nota19, nota20,  (err, rel) => {
			if(err){
				console.log(err);
			}else{
				res.locals.success = "Enviado";	
				res.redirect("/reluc/" + req.body.idUC + "/" + anoLetivo.replace('-','_'));
			}
		})
		
	}else{
		//update
		let rel = require('../models/updRelUC.js')(idRelUC, idCE, anoLetivo, docenteResp, hrsContDocResp, uc, obs, ce, ano, semestre, ects, totHrs, hrsT, hrsTP, hrsPL, hrsTC, hrsS, hrsE, hrsOT, hrso, aulasPrev, percEaD, nomeDoc1,nrTurmDoc1, doc1T,doc1TP ,doc1PL, doc1TC, doc1S, doc1E, doc1OT, doc1O, doc1AulasPrev, doc1AulasLec, doc1PrecAulas, nomeDoc2, nrTurmDoc2, doc2T, doc2TP, doc2PL, doc2TC,doc2S,doc2E, doc2OT, doc2O, doc2AulasPrev, doc2AulasLec, doc2PrecAulas, nomeDoc3, nrTurmDoc3, doc3T, doc3TP, doc3PL, doc3TC, doc3S,doc3E, doc3OT, doc3O, doc3AulasPrev, doc3AulasLec, doc3PrecAulas, nomeDoc4, nrTurmDoc4, doc4T, doc4TP, doc4PL, doc4TC, doc4S,doc4E, doc4OT, doc4O, doc4AulasPrev, doc4AulasLec, doc4PrecAulas, nomeDoc5, nrTurmDoc5, doc5T, doc5TP, doc5PL, doc5TC, doc5S,doc5E, doc5OT, doc5O, doc5AulasPrev, doc5AulasLec, doc5PrecAulas, nomeDoc6, nrTurmDoc6, doc6T, doc6TP, doc6PL, doc6TC, doc6S,doc6E, doc6OT, doc6O, doc6AulasPrev, doc6AulasLec, doc6PrecAulas, nomeDoc7, nrTurmDoc7, doc7T, doc7TP, doc7PL, doc7TC, doc7S,doc7E, doc7OT, doc7O, doc7AulasPrev, doc7AulasLec, doc7PrecAulas, nomeDoc8, nrTurmDoc8, doc8T, doc8TP, doc8PL, doc8TC, doc8S,doc8E, doc8OT, doc8O, doc8AulasPrev, doc8AulasLec, doc8PrecAulas, nomeDoc9, nrTurmDoc9, doc9T, doc9TP, doc9PL, doc9TC, doc9S,doc9E, doc9OT, doc9O, doc9AulasPrev, doc9AulasLec, doc9PrecAulas, nomeDoc10, nrTurmDoc10, doc10T, doc10TP, doc10PL, doc10TC, doc10S,doc10E, doc10OT, doc10O, doc10AulasPrev, doc10AulasLec, doc10PrecAulas, momAvalCont1, dtaAvalCont1, momAvalCont2, dtaAvalCont2, momAvalCont3, dtaAvalCont3, momAvalCont4, dtaAvalCont4, momAvalCont5, dtaAvalCont5, momAvalCont6, dtaAvalCont6, momAvalCont7, dtaAvalCont7, dtaAvalFimEN, dtaAvalFimEE, dtaAvalFimEF, dtaAvalFimET, estudA, estudB, estudC,estudC1,estudC2,estudC3,estudC4,estudC5, estudD, estudD1, estudD2, estudE, estudE1, estudE2, estudE3, comentarios, semestreLetivo,  nota10, nota11, nota12, nota13,nota14,nota15, nota16, nota17, nota18, nota19, nota20,  (err, rel) => {
			if(err){
				console.log(err);
			}else{
				res.locals.success = "Enviado";	
				res.redirect("/reluc/" + req.body.idUC + "/" + anoLetivo.replace('-','_'));
			}
		})
	}
	

	
})

router.get("/pdfRelCe/:idCe", isLoggedIn, (req, res) =>{
	let anoLetivo = "2025/26"
	let finalizado = require("../models/setFinalizado.js")(req.params.idCe, anoLetivo, (err, fin) => {
		if(err)
			console.log(err)
	})
	let ce = require("../models/getRelCE.js")(req.params.idCe, anoLetivo, (err, ce) => {
		if(err)
			console.log(err);
		else{
			let fuc = require("../models/getFucsByyear.js")(req.params.idCe,anoLetivo, (err, fucs) =>{
				if(err)
					console.log(err);
				else{
					let dadosFuc = require("../models/getDadosFucsByYear.js")(req.params.idCe, anoLetivo, (err, dados) => {
						if(err)
							console.log(err)
						else{
							let drop = require("../models/getDropCEByYear.js")(req.params.idCe, anoLetivo, (err, drops) => {
								if(err)
									console.log(err)
								else{
									res.render("relCePDF", {ce:ce, fucs:fucs, dados:dados, drops:drops, idCe:req.params.idCe, anoLetivo:anoLetivo});
								}
							})
						}
					})
				}
			})
		}
	})
})

router.get("/Documents/:filename",isLoggedIn, (req, res) => {
	console.log('Documents/' + req.params.filename);
	res.sendFile('Documents/' + req.params.filename, {root: '.'});
});

router.get("/Documents/:filename",isLoggedIn, (req, res) => {
	console.log('Documents/' + req.params.filename);
	res.sendFile('Documents/' + req.params.filename, {root: '.'});
});


router.get("/Documents/:filename",isLoggedIn, (req, res) => {
	console.log('Documents/' + req.params.filename);
	res.sendFile('Documents/' + req.params.filename, {root: '.'});
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if(err){
			console.log(err);
			res.status(500).send('Error logging out');
		}else{
			res.render("login");
		}
	})
});

async function sendRacNotif(codCe, anoLetivo, dados, ce, fucs, drops){
	const nodemailer = require("nodemailer");
	const  generatePdf  = require("./racMailPdf.js");
	const siglas = ['L-Enfermagem','L-Fisioterapia','L-Osteopatia','L-Farmácia','M-Enfermagem Médico-Cirúrgica na Área de Enfermagem à Pessoa em Situação Crónica','M-Enfermagem Médico-Cirúrgica na Área de Enfermagem à Pessoa em Situação Crítica','M-Enfermagem Comunitária na área de Enfermagem de Saúde Comunitária e de Saúde Pública','M-Enfermagem de Reabilitação','M-Enfermagem Comunitária na área de Enfermagem de Saúde Familiar','M – Fisioterapia','M – Osteopatia'];
    
	try {
		
		const pdfBuffer = await generatePdf(dados, drops, ce, fucs);

		let curso = require('../models/getDadosMailRAC.js')(codCe, (err, ce) => {
			if(err)
				console.log(err);
			else{
				// Create a transporter using Ethereal test credentials.
				// For production, replace with your actual SMTP server details.
				const transporter = nodemailer.createTransport({
					host: "smtp.office365.com",
					port: 587,
					secure: false, // Use true for port 465, false for port 587
					auth: {
						user: "smtprelay@uatla.pt",
						pass: "mw#=W72Xe+&zn%Vm",
					},
				});
				let destino = "";
				var img = "";
				if(siglas.includes(ce[0].nomeExt)){
					img = './public/img/logo_essatla_small.png';
					destino="hjose";
				}
				else{
					img = './public/img/logo_old_small.png';
					destino="mfreitas";
				}	

				(async () => {
					const info = await transporter.sendMail({
						from: '"RAC" <noreply@uatlantica.pt>',
						to: destino + "@uatlantica.pt",
						cc: "gaqinfo@uatlantica.pt, " + ce[0].login.substring(0, ce[0].login.length - 1) + "@uatlantica.pt",
						subject: "RAC - " + ce[0].nomeExt + " (" + anoLetivo + ")",
						attachments: [
							{
							filename: 'logo.png',
							path: img,
							cid: 'logo@smtprelay' // unique identifier for this attachment
							},
							{
								filename: "RAC_" + ce[0].nomeExt + "_" + anoLetivo + ".pdf",
								content: pdfBuffer,
								contentType: "application/pdf",
							}
						],

						text: "RAC - Relatório Anual de Curso\n" + ce[0].nomeExt + "\n" + anoLetivo + "\n\n\nCoordenador do CE:\n" + ce[0].nomeCoord + "Notificação de preenchimento do relatório\nPara mais informação: gaqinfo@uatlantica.pt\nGabinete de Autoavaliação para a Qualidade\nATLÂNTICA - Instituto Universitário", // Plain-text version of the message
						html: "<p><img src='cid:logo@smtprelay' alt='logo width='100'></p><br/><br/><p><b>RAC - Relatório Anual de Curso</b></p><p>" + ce[0].nomeExt + "</p><p>" + anoLetivo + "</p><br/><br/><p>Coordenador do CE:</p><p>" + ce[0].nomeCoord + "</p><br/><br/><p>Notificação de preenchimento do relatório</p><p>Para mais informação: <a href='mailto:gaqinfo@uatlantica.pt'>gaqinfo@uatlantica.pt</a></p><p>Gabinete de Autoavaliação para a Qualidade</p><br/><p>ATLÂNTICA - Instituto Universitário</p>" , // HTML version of the message
					});
					console.log("Message sent:", info.messageId);
				})();
			}
		})
	} catch (error) {
    console.error(error);
	}
}

async function sendRucNotif(relUC){
	let anoLetivo=relUC[0].anoLetivo.replace("-", "/");
	const nodemailer = require("nodemailer");
	const  generatePdf  = require("./rucMailPdf.js");
	const siglas = ['L-Enfermagem','L-Fisioterapia','L-Osteopatia','L-Farmácia','M-Enfermagem Médico-Cirúrgica na Área de Enfermagem à Pessoa em Situação Crónica','M-Enfermagem Médico-Cirúrgica na Área de Enfermagem à Pessoa em Situação Crítica','M-Enfermagem Comunitária na área de Enfermagem de Saúde Comunitária e de Saúde Pública','M-Enfermagem de Reabilitação','M-Enfermagem Comunitária na área de Enfermagem de Saúde Familiar','M – Fisioterapia','M – Osteopatia'];

	try{
		const pdfBuffer = await generatePdf(relUC);

		let curso = require('../models/getDadosMailRUC.js')(relUC[0].ce, (err, curso) => {
			if(err)
				console.log(err);
			else{
				let docente = require('../models/getDadosDocenteRUCMail.js')(relUC[0].docenteResp, (err, docente) => {
					if(err)
						console.log(err);
					else{
						// Create a transporter using Ethereal test credentials.
						// For production, replace with your actual SMTP server details.
						const transporter = nodemailer.createTransport({
							host: "smtp.office365.com",
							port: 587,
							secure: false, // Use true for port 465, false for port 587
							auth: {
								user: "smtprelay@uatla.pt",
								pass: "mw#=W72Xe+&zn%Vm",
							},
						});
						
						var img = "";
						if(siglas.includes(relUC[0].ce))
							img = './public/img/logo_essatla_small.png';
						else
							img = './public/img/logo_old_small.png';


						const coord = curso;
						// 1. Obter e formatar os emails
						const emailsArray = coord[coord.length - 1].login_doc
						.split(';')
						.filter(login => login.trim() !== '')
						.map(login => `${login.trim()}@uatla.pt`);

						// 2. Juntar os emails numa única string separada por vírgulas
						const destinatarios = emailsArray.join(', ');

						(async () => {
							
							console.log('Mail sent \nto: ' + destinatarios + '\ncc' + docente[0].login_doc);
							const info = await transporter.sendMail({
								from: '"RUC" <noreply@uatlantica.pt>',
								to: destinatarios,
								cc: "gaqinfo@uatlantica.pt," + docente[0].login_doc + "@uatlantica.pt",
								subject: "RUC - " + relUC[0].uc + " em " + relUC[0].ce + " (" + anoLetivo + ")",
								attachments: [
									{
									filename: 'logo.png',
									path: img,
									cid: 'logo@smtprelay' // unique identifier for this attachment
									},
									{
										filename: "RUC_" + relUC[0].uc + "_" + relUC[0].ce + "_" + anoLetivo + "_" + ".pdf",
										content: pdfBuffer,
										contentType: "application/pdf",
									}
								],

								text: "RUC - Relatório de Unidade Curricular\n" + relUC[0].uc + "\n" + relUC[0].ce + "\n" + anoLetivo + "\n" + relUC[0].semestre + " Semestre\n\n\nResponsável da UC:\n" + relUC[0].docenteResp + "Notificação de preenchimento do relatório\nPara mais informação: gaqinfo@uatlantica.pt\nGabinete de Autoavaliação para a Qualidade\n" + siglas.includes(relUC[0].ce) ? " ESSATLA - Escola Superior de Saúde Atlântica" : " ATLÂNTICA - Instituto Universitário", // Plain-text version of the message
								html: siglas.includes(relUC[0].ce) ? "<p><img src='cid:logo@smtprelay' alt='logo width='100'></p><br/><br/><p><b>RUC - Relatório de Unidade Curricular</b></p><p>" + relUC[0].uc + "</p><p>" + relUC[0].ce + "</p><p>" + anoLetivo + "</p><p>" + relUC[0].semestre + " Semestre</p><br/><br/><p>Responsável da UC:</p><p>" + relUC[0].docenteResp + "</p><br/><br/><p>Notificação de preenchimento do relatório</p><p>Para mais informação: <a href='mailto:gaqinfo@uatlantica.pt'>gaqinfo@uatlantica.pt</a></p><p>Gabinete de Autoavaliação para a Qualidade</p><br/><p>ESSATLA - Escola Superior de Saúde Atlântica</p>" : "<p><img src='cid:logo@smtprelay' alt='logo width='100'></p><br/><br/><p><b>RUC - Relatório de Unidade Curricular</b></p><p>" + relUC[0].uc + "</p><p>" + relUC[0].ce + "</p><p>" + anoLetivo + "</p><p>" + relUC[0].semestre + " Semestre</p><br/><br/><p>Responsável da UC:</p><p>" + relUC[0].docenteResp + "</p><br/><br/><p>Notificação de preenchimento do relatório</p><p>Para mais informação: <a href='mailto:gaqinfo@uatlantica.pt'>gaqinfo@uatlantica.pt</a></p><p>Gabinete de Autoavaliação para a Qualidade</p><br/><p>ATLÂNTICA - Instituto Universitário</p>", // HTML version of the message
							});
							console.log("Message sent:", info.messageId);
						})();
					}
				}) 
			}
		})

	} catch (error) {
    console.error(error);
	}
}

const vazioSeZero = (v) => (v === 0 || v === '0' || v == null ? '' : v);
router.post('/saveDocentes', (req, res) => {
    const b = req.body;

    const docs = [];
    for (let i = 2; i <= 10; i++) {
        docs.push(vazioSeZero(b['doc' + i]));
    }

    require('../models/setDocAux.js')(b.idUc, ...docs, (err) => {
        res.json({ success: !err });
    });
});

router.get("/teste", isLoggedIn, (req, res)=>{
	res.render("teste")
})

function undefinedToNull(value) {
	console.log(value);
    return value === undefined ? 0 : value;
}

function removeChar(charToRemove, charToReplace,  str){
	try{
			str = str.replaceAll(charToRemove, charToReplace);
	}catch{
			str = str 
	}
		return str;
}

function isLoggedIn(req, res, next){
	if(req.session.user){
		return next();
	}
	res.redirect("/login");
}

function obterAnoLetivo() {
    const hoje = new Date();

    // Janeiro = 0, Junho = 5
    let ano = hoje.getFullYear();

    // Se for de janeiro até junho, o ano letivo termina nesse ano,
    // por isso o início é o ano anterior.
    if (hoje.getMonth() <= 5) {
        ano--;
    }

    const anoSeguinte = String((ano + 1) % 100).padStart(2, '0');

    return `${ano}/${anoSeguinte}`;
}

module.exports = router;
