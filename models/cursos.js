let cursos = function getCursos(user, role, ano, callback){
	var sql = require('./db.js');

	if(role=='docente'){
		sql.query("SELECT cursos.sigla as 'Sigla', cursos.nomeExt as 'Curso', idCursos as 'ID' ,fucs.nomeUCPt as 'UC',UC_Acesso.ano as 'Ano',UC_Acesso.semestre as 'Semestre',UC_Acesso.nome_doc as 'Nome_Docente',UC_Acesso.login_doc as 'Login',UC_Acesso.role as 'Papel' FROM Qualidade.UC_Acesso inner join Qualidade.cursos on UC_Acesso.curso = cursos.idCursos INNER JOIN Qualidade.fucs on UC_Acesso.UC = fucs.idFucs where UC_Acesso.login_doc like '" + user + "' and anoLetivo like '" + ano + "' order by Curso,  Ano, Semestre,UC;", (err, result) => {
			if(err){
				console.log(err);
			}else{
				result = valoresUnicos(result, "Sigla");
				console.log('res -> ', result);
				callback(null, result);
			}
		})
	}else if(role =='coordenador'){
		sql.query("SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where login like '%" + user + ";%' and anoLetivo like '" + ano + "' order by ies,ciclo ;", (err, result) => {
			if(err){
				console.log(err);
			}else{
				//result = valoresUnicos(result, "Sigla");
				callback(null, result);
			}
		})
	}else if(role=='administrador'){
		if(user=='nataliaes' || user == 'presidentegrupoEIA' || user=="cduarte" || user =="ncarvalho"){
			sql.query("SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where anoLetivo like '" + ano + "' order by ies,ciclo ;", (err, result) => {
				if(err){
					console.log(err);
				}else{
					callback(null, result);
				}
			})
		}else if(user=='mfreitas'){
			sql.query("SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where ies like 'A' and anoLetivo like '" + ano + "' order by ies,ciclo ;", (err, result) => {
				if(err){
					console.log(err);
				}else{
					callback(null, result);
				}
			})
		}else if(user=='hjose'){
			sql.query("SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where ies like 'E' and anoLetivo like '" + ano + "' order by ies,ciclo ;", (err, result) => {
				if(err){
					console.log(err);
				}else{
					callback(null, result);
				}
			})
		}
		else{
			console.log("Role-> ", role)
		}
	}else if(role=='gestor'){
		sql.query("SELECT * FROM Qualidade.gestoresFucs where login = '" + user +"';", (err, gestor)=>{
			if(err){
				console.log(err);
			}else{
				let query = "";
				if(gestor[0].uatla == 1 && gestor[0].essatla == 1) query = "SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where anoLetivo like '" + ano + "' order by ies,ciclo ;";
				else if(gestor[0].uatla == 1) query = "SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where ies='A' and anoLetivo like '" + ano + "' order by ies,ciclo ;";
				else if(gestor[0].essatla == 1)query = "SELECT sigla as 'Sigla', nomeExt as 'Curso', idCursos as 'ID' from Qualidade.cursos where ies='E' and anoLetivo like '" + ano + "' order by ies,ciclo ;";
				sql.query(query, (err, result) =>{
					if(err){		
						console.log(err);
					}else{
						callback(null, result);
					}
				})
			}
		})
	}else
		console.log("Role-> ", role)
}


function valoresUnicos(lista, campo) {
  const vistos = new Set();
  return lista.filter(item => {
    if (vistos.has(item[campo])) {
      return false; // já existe → ignora
    }
    vistos.add(item[campo]); // primeira vez → guarda
    return true;
  });
}


module.exports = cursos;
