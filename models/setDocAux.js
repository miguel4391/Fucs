var Docentes = function setDocentes(idUC, doc2, doc3,doc4,doc5,doc6,doc7,doc8,doc9,doc10, callback){
    var sql = require('./db.js');

    let fields = [];

    if (doc2){
         fields.push(`doc2Nome='${doc2}'`);
         fields.push(`doc2Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc2}'
        LIMIT 1
    )`);
    fields.push(`doc2Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc2}'
        LIMIT 1
    )`);
    }
    if (doc3 ){ 
        fields.push(`doc3Nome='${doc3}'`);
        fields.push(`doc3Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc3}'
        LIMIT 1
    )`);
    fields.push(`doc3Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc3}'
        LIMIT 1
    )`);
    }
    if (doc4 ){ 
        fields.push(`doc4Nome='${doc4}'`);
        fields.push(`doc4Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc4}'
        LIMIT 1
    )`);
    fields.push(`doc4Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc4}'
        LIMIT 1
    )`);
    }
    if (doc5 ){ 
        fields.push(`doc5Nome='${doc5}'`);
        fields.push(`doc5Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc5}'
        LIMIT 1
    )`);
    fields.push(`doc5Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc5}'
        LIMIT 1
    )`);
    }
    if (doc6 ){ 
        fields.push(`doc6Nome='${doc6}'`);
        fields.push(`doc6Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc6}'
        LIMIT 1
    )`);
    fields.push(`doc6Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc6}'
        LIMIT 1
    )`);
    }
    if (doc7 ){ 
        fields.push(`doc7Nome='${doc7}'`);
        fields.push(`doc7Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc7}'
        LIMIT 1
    )`);
    fields.push(`doc7Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc7}'
        LIMIT 1
    )`);
    }
    if (doc8 ){ 
        fields.push(`doc8Nome='${doc8}'`);
        fields.push(`doc8Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc8}'
        LIMIT 1
    )`);
    fields.push(`doc8Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc8}'
        LIMIT 1
    )`);
    }
    if (doc9 ){ 
        fields.push(`doc9Nome='${doc9}'`);
        fields.push(`doc9Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc9}'
        LIMIT 1
    )`);
    fields.push(`doc9Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc9}'
        LIMIT 1
    )`);
    }
    if (doc10){ 
        fields.push(`doc10Nome='${doc10}'`);
        fields.push(`doc10Cat=(
        SELECT catDoc
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc10}'
        LIMIT 1
    )`);
    fields.push(`doc10Grau=(
        SELECT grauDocExt
        FROM Qualidade.fichaDoc_slt
        WHERE nomeDoc='${doc10}'
        LIMIT 1
    )`);
    }

    let query = '';

    if (fields.length === 0) {
        return callback(null, {
            affectedRows: 0
        });
    }

    if (fields.length > 0) {
        query = `
            UPDATE Qualidade.fucs
            SET ${fields.join(', ')}
            WHERE idfucs = ${idUC}
        `;
    }

    console.log(query);

    sql.query(query, (err, result) => {
        if (err) {
            return callback(err);
        }

        console.log('affectedRows:', result.affectedRows);
        console.log('changedRows:', result.changedRows);

        // CLOSE FLOW HERE (always)
        return callback(null, {
            updated: result.affectedRows > 0,
            changed: result.changedRows
        });
    });
}

    

module.exports = Docentes;