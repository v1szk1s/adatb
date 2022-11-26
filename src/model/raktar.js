const db = require("../config/database.js");

////////////
// Raktar:
////////////

const addRaktar = async (varos, utca, kapacitas) => {
    if(isNaN(kapacitas)){
        return false;
    }
    console.log(db);
    await db.query(`INSERT INTO raktar (varos, utca, kapacitas) VALUES ("${varos}", "${utca}",  ${kapacitas})`);
    return true;
}
exports.addRaktar = addRaktar;

const getAllRaktar = async () => {
    let [rows, fields] = await db.query("SELECT * FROM raktar");
    return rows;
}
exports.getAllRaktar = getAllRaktar;

const getRaktarByUserId = async (id) => {
    let [rows, fields] = await db.query(`SELECT * FROM raktar,felhasznalo WHERE raktar.raktar_id=felhasznalo.raktar_id AND felhasznalo_id=${id}`);
    return rows[0].varos + ", " + rows[0].utca;
}
exports.getRaktarByUserId = getRaktarByUserId;

const deleteRaktar = async (id) => {
    await db.query(`UPDATE felhasznalo SET raktar_id=NULL  WHERE raktar_id=${id}`);
    await db.query(`DELETE FROM raktar WHERE raktar_id=${id}`);
}
exports.deleteRaktar = deleteRaktar;

const editRaktar = async (id, varos, utca, kapacitas) => {
    await db.query(`UPDATE raktar SET varos = "${varos}", utca = "${utca}", kapacitas = ${kapacitas} WHERE raktar_id=${id}`);
}
exports.editRaktar = editRaktar;

const getRaktarNameById = async (id) => {
    let [rows, fields] = await db.query(`SELECT CONCAT(varos,", ", utca) AS nev FROM raktar WHERE raktar_id=${id};`);
    return rows[0].nev;
}
exports.getRaktarNameById = getRaktarNameById;


const deleteFromKeszlet = async (aru_id) =>{
    await db.query(`DELETE FROM keszlet WHERE aru_id=${aru_id}`);
}
exports.deleteFromKeszlet = deleteFromKeszlet;

////////////
// Aru:
////////////

const getAllAruByRaktarId = async (id) => {
    let [rows, fields] = await db.query(`SELECT aru.aru_id, nev, suly, terfogat, mennyiseg, ar FROM aru, keszlet WHERE aru.aru_id=keszlet.aru_id AND keszlet.raktar_id=${id}`);
    return rows;
}
exports.getAllAruByRaktarId = getAllAruByRaktarId;

const addToKeszlet = async (raktar_id, aru_id, mennyiseg) => {
    const aruk = await getAllAruByRaktarId(raktar_id);
    let jelenlegi = 0;
    for(let a of aruk){
        if(a.aru_id == aru_id)
            jelenlegi += a.mennyiseg;
    }
    if(jelenlegi === 0){
        await db.query(`INSERT INTO keszlet (raktar_id, aru_id, mennyiseg) VALUES (${raktar_id}, ${aru_id}, ${mennyiseg});`);
    }else{
        await db.query(`UPDATE keszlet SET mennyiseg=${+mennyiseg+jelenlegi} WHERE aru_id=${aru_id} AND raktar_id=${raktar_id}`);
    }
    return true;
}
exports.addToKeszlet = addToKeszlet;

const editKeszlet = async (raktar_id, aru_id, mennyiseg) => {
    await db.query(`UPDATE keszlet SET mennyiseg=${mennyiseg} WHERE aru_id=${aru_id} AND raktar_id=${raktar_id}`);
}
exports.editKeszlet = editKeszlet;

const addAru = async (nev, terfogat, suly, ar) => {
    if(isNaN(ar) || isNaN(suly) || isNaN(ar)){
        return false;
    }
    await db.query(`INSERT INTO aru (nev, terfogat, suly, ar) VALUES ("${nev}", ${terfogat}, ${suly}, ${ar})`);
    return true;
}
exports.addAru = addAru;

const deleteAru = async (id) => {
    await db.query(`DELETE FROM aru WHERE aru_id=${id}`);
}
exports.deleteAru = deleteAru;

const getAllAru = async () => {
    let [rows, fields] = await db.query("SELECT * FROM aru");
    return rows;
}
exports.getAllAru = getAllAru;

const editAru = async (id, nev, terfogat, suly, ar) => {
    await db.query(`UPDATE aru SET nev = "${nev}", terfogat=${terfogat}, suly=${suly}, ar=${ar} WHERE aru_id=${id}`);
}
exports.editAru = editAru;
