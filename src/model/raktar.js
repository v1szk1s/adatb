const db = require("../config/database.js");

////////////
// Raktar:
////////////

exports.addRaktar = async (varos, utca, kapacitas) => {
    if(isNaN(kapacitas)){
        return false;
    }
    console.log(db);
    await db.query(`INSERT INTO raktar (varos, utca, kapacitas) VALUES ("${varos}", "${utca}",  ${kapacitas})`);
    return true;
}

exports.getAllRaktar = async () => {
    let [rows, fields] = await db.query("SELECT * FROM raktar");
    return rows;
}
exports.getRaktarByUserId = async (id) => {
    let [rows, fields] = await db.query(`SELECT * FROM raktar,felhasznalo WHERE raktar.raktar_id=felhasznalo.raktar_id AND felhasznalo_id=${id}`);
    return rows[0].varos + ", " + rows[0].utca;
}

exports.deleteRaktar = async (id) => {
    await db.query(`UPDATE felhasznalo SET raktar_id=NULL  WHERE raktar_id=${id}`);
    await db.query(`DELETE FROM raktar WHERE raktar_id=${id}`);
}

exports.editRaktar = async (id, varos, utca, kapacitas) => {
    await db.query(`UPDATE raktar SET varos = "${varos}", utca = "${utca}", kapacitas = ${kapacitas} WHERE raktar_id=${id}`);
}

exports.getRaktarNameById = async (id) => {
    let [rows, fields] = await db.query(`SELECT CONCAT(varos,", ", utca) AS nev FROM raktar WHERE raktar_id=${id};`);
    return rows[0].nev;
}

//exports.addToKeszlet = async (raktar_id, aru_id, db) => {
exports.addToKeszlet = async (egy, ketto, harom) => {
//    if(isNaN(raktar_id) || isNaN(aru_id) || isNaN(db)){
//        return false;
//    }
    //await db.query(`INSERT INTO keszlet (raktar_id, aru_id, mennyiseg) VALUES (${raktar_id}, ${aru_id}, ${db});`);
    await db.query(`INSERT INTO keszlet (raktar_id, aru_id, mennyiseg) VALUES (3, 1, 2)`);
    return true;
}

exports.deleteFromKeszlet = async (aru_id) =>{
    await db.query(`DELETE FROM keszlet WHERE aru_id=${aru_id}`);
}

////////////
// Aru:
////////////

exports.getAllAruByRaktarId = async (id) => {
    let [rows, fields] = await db.query(`SELECT * FROM aru, keszlet WHERE aru.aru_id=keszlet.aru_id AND keszlet.raktar_id=${id}`);
    return rows;
}

exports.addAru = async (nev, terfogat, suly, ar) => {
    if(isNaN(ar) || isNaN(suly) || isNaN(ar)){
        return false;
    }
    await db.query(`INSERT INTO aru (nev, terfogat, suly, ar) VALUES ("${nev}", ${terfogat}, ${suly}, ${ar})`);
    return true;
}

exports.deleteAru = async (id) => {
    await db.query(`DELETE FROM aru WHERE aru_id=${id}`);
}

exports.getAllAru = async () => {
    let [rows, fields] = await db.query("SELECT * FROM aru");
    return rows;
}

exports.editAru = async (id, nev, terfogat, suly, ar) => {
    await db.query(`UPDATE aru SET nev = "${nev}", terfogat=${terfogat}, suly=${suly}, ar=${ar} WHERE aru_id=${id}`);
}
