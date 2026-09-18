var Curso = function setCurso(idCurso, login, nome, callback) {

    var sql = require('./db.js');

    console.log("Teste-> ", idCurso, login, nome);

    sql.query(
        "CALL UC_Acesso_Curso_upd (?, ?, ?)",
        [idCurso, login, nome],
        (err, result) => {

            if (err) {
                console.log('Erro: ', err);
                callback(err);
            } else {
                callback(null, result);
            }

        }
    );
};

module.exports = Curso;