var Docentes = function setDocentes(idUC, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, callback) {
    var sql = require('./db.js');

    const docsMap = { doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10 };

    let setClauses = [];
    let params = [];

    for (const [key, value] of Object.entries(docsMap)) {
        // valor "0" (número ou string) => grava strings vazias
        if (value === 0 || value === '0') {
            setClauses.push(`${key}Nome = ?`);
            setClauses.push(`${key}Cat = ?`);
            setClauses.push(`${key}Grau = ?`);
            params.push('', '', '');
        }
        // valor normal (não vazio, não "0") => faz o lookup como antes
        else if (value) {
            setClauses.push(`${key}Nome = ?`);
            setClauses.push(`${key}Cat = (
                SELECT catDoc
                FROM Qualidade.fichaDoc_slt
                WHERE nomeDoc = ?
                LIMIT 1
            )`);
            setClauses.push(`${key}Grau = (
                SELECT grauDocExt
                FROM Qualidade.fichaDoc_slt
                WHERE nomeDoc = ?
                LIMIT 1
            )`);
            params.push(value, value, value);
        }
        // valor vazio/undefined/null => não mexe no campo (comportamento original)
    }

    if (setClauses.length === 0) {
        return callback(null, { affectedRows: 0 });
    }

    const query = `
        UPDATE Qualidade.fucs
        SET ${setClauses.join(', ')}
        WHERE idfucs = ?
    `;
    params.push(idUC);

    sql.query(query, params, (err, result) => {
        if (err) {
            return callback(err);
        }

        console.log('affectedRows:', result.affectedRows);
        console.log('changedRows:', result.changedRows);

        return callback(null, {
            updated: result.affectedRows > 0,
            changed: result.changedRows
        });
    });
};

module.exports = Docentes;