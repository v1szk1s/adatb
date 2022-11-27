const db = require("../config/database.js");
/////////////
// USER
////////////

const addUser = async (email, nev, raktar_id, jelszo) => {
    await db.query(`INSERT INTO felhasznalo (email, nev, raktar_id, jelszo, role) VALUES ("${email}", "${nev}", ${raktar_id}, "${jelszo}", "USER")`);
    return true;
}
exports.addUser = addUser;

const editUser = async (id, nev, email, role, raktar_id) => {
    await db.query(`UPDATE felhasznalo SET nev = "${nev}", email = "${email}", role = "${role}", raktar_id=${raktar_id}  WHERE felhasznalo_id=${id}`);
}
exports.editUser = editUser;

const deleteUser = async (id) => {
    await db.query(`DELETE FROM felhasznalo WHERE felhasznalo_id=${id}`);
}
exports.deleteUser = deleteUser;

const getUserByEmail = async (email) => {
    let [rows, fields] = await db.query(`SELECT * FROM felhasznalo WHERE email="${email}"`);
    return rows[0];
}
exports.getUserByEmail = getUserByEmail;

const getAllFreeUser = async () => {
    let [rows, fields] = await db.query(`SELECT * FROM felhasznalo WHERE raktar_id IS NULL `);
    return rows;
}
exports.getAllFreeUser = getAllFreeUser;

const getAllRaktarUser = async () => {
    let [rows, fields] = await db.query(`SELECT felhasznalo.raktar_id, felhasznalo.felhasznalo_id, felhasznalo.nev, felhasznalo.email, felhasznalo.role ,CONCAT(raktar.varos,", " ,raktar.utca) as raktar from felhasznalo, raktar where felhasznalo.raktar_id = raktar.raktar_id`);
    return rows;
}
exports.getAllRaktarUser = getAllRaktarUser;

const updatePassword = async (email, uj_jelszo) => {
    await db.query(`UPDATE felhasznalo SET jelszo="${uj_jelszo}"  WHERE email="${email}"`);
}
exports.updatePassword = updatePassword;

const updateEmail = async (email, uj_email) => {
    await db.query(`UPDATE felhasznalo SET email="${uj_email}"  WHERE email="${email}"`);
}
exports.updateEmail = updateEmail;

const updateName = async (email, uj_nev) => {
    await db.query(`UPDATE felhasznalo SET nev="${uj_nev}"  WHERE email="${email}"`);
}
exports.updateName = updateName;

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
    await db.query(`DELETE FROM rakomany WHERE szallitmany_id IN (SELECT szallitmany_id FROM szallitmany WHERE honnan_raktar_id=${id} OR hova_raktar_id=${id})`);
    await db.query(`DELETE FROM szallitmany WHERE honnan_raktar_id=${id} OR hova_raktar_id=${id}`);
    await db.query(`DELETE FROM keszlet WHERE raktar_id=${id}`);
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
// aruk:
////////////

const getAllAruByRaktarId = async (id) => {
    let [rows, fields] = await db.query(`SELECT aru.aru_id, nev, suly, terfogat, mennyiseg, ar FROM aru, keszlet WHERE aru.aru_id=keszlet.aru_id AND keszlet.raktar_id=${id}`);
    return rows;
}
exports.getAllAruByRaktarId = getAllAruByRaktarId;

const getAllAruByIdArr = async (arr) => {
    let [rows, fields] = await db.query(`SELECT * FROM aru WHERE aru_id IN (${arr})`);
    return rows;
}
exports.getAllAruByIdArr = getAllAruByIdArr;

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

const getAruMennyisegByRaktarIdAruId = async (raktar_id, aru_id) => {
    let [rows, fields] = await db.query(`SELECT * FROM keszlet WHERE aru_id=${aru_id} AND raktar_id=${raktar_id}`);
    if(rows.length > 0)
        return rows[0].mennyiseg;
    else 
        return 0;
}
exports.getAruMennyisegByRaktarIdAruId = getAruMennyisegByRaktarIdAruId;

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
    await db.query(`DELETE FROM keszlet WHERE aru_id=${id}`);
    await db.query(`DELETE FROM rakomany WHERE aru_id=${id}`);
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

/////////////
// szallitmany
/////////////

const getAllSzallitmany = async () => {
    let [rows, fields] = await db.query(`SELECT szallitmany_id, honnan.raktar_id as honnan_id, hova.raktar_id as hova_id, idopont, CONCAT(honnan.varos, ", ", honnan.utca) AS honnan, CONCAT(hova.varos, ", ", hova.utca) AS hova, felhasznalo.nev from szallitmany, raktar as honnan, raktar as hova, felhasznalo where honnan_raktar_id = honnan.raktar_id and hova.raktar_id = hova_raktar_id AND felhasznalo.felhasznalo_id = szallitmany.felhasznalo_id`);
    
    return rows;
}
exports.getAllSzallitmany = getAllSzallitmany;

const getAllSzallitmanyByRaktarId = async (raktar_id) => {
    let [rows, fields] = await db.query(`SELECT szallitmany_id, honnan.raktar_id as honnan_id, hova.raktar_id as hova_id, idopont, CONCAT(honnan.varos, ", ", honnan.utca) AS honnan, CONCAT(hova.varos, ", ", hova.utca) AS hova, felhasznalo.nev from szallitmany, raktar as honnan, raktar as hova, felhasznalo WHERE honnan_raktar_id = honnan.raktar_id and hova.raktar_id = hova_raktar_id AND felhasznalo.felhasznalo_id = szallitmany.felhasznalo_id AND (honnan_raktar_id=${raktar_id} OR hova_raktar_id=${raktar_id}) ORDER BY honnan.utca`);
    
    return rows;
}
exports.getAllSzallitmanyByRaktarId = getAllSzallitmanyByRaktarId;

const getAllSzallitmanyIdByDate = async (idopont) => {
    let [rows, fields] = await db.query(`SELECT szallitmany_id from szallitmany WHERE idopont="${idopont}"`);
    return rows[0];
}
exports.getAllSzallitmanyIdByDate = getAllSzallitmanyIdByDate;

const addSzallitmany = async (time, email, honnan, hova) => {
    const user = await getUserByEmail(email);

    await db.query(`INSERT INTO szallitmany (felhasznalo_id, honnan_raktar_id, hova_raktar_id, idopont) VALUES ("${user.felhasznalo_id}", ${honnan}, ${hova}, "${time}")`);
}
exports.addSzallitmany = addSzallitmany;

const editSzallitmany = async (id, honnan, hova) => {
    await db.query(`UPDATE szallitmany SET honnan_raktar_id=${honnan}, hova_raktar_id=${hova} WHERE szallitmany_id=${id}`);
}
exports.editSzallitmany = editSzallitmany;

const deleteSzallitmany = async (id) => {
    await db.query(`DELETE FROM rakomany WHERE szallitmany_id=${id}`);
    await db.query(`DELETE FROM szallitmany WHERE szallitmany_id=${id}`);
}
exports.deleteSzallitmany = deleteSzallitmany;

const addToRakomany = async (szallitmany_id, aru_id, mennyiseg) => {
    await db.query(`INSERT INTO rakomany (szallitmany_id, aru_id, mennyiseg) VALUES (${szallitmany_id},${aru_id},${mennyiseg})`);
}
exports.addToRakomany = addToRakomany;

const editRakomany = async (szallitmany_id, aru_id, mennyiseg) => {
    await db.query(`UPDATE rakomany SET mennyiseg=${mennyiseg} WHERE szallitmany_id=${szallitmany_id} AND aru_id=${aru_id}`);
}
exports.editRakomany = editRakomany;

const deleteFromRakomany = async (szallitmany_id, aru_id) => {
    await db.query(`DELETE FROM rakomany WHERE szallitmany_id=${szallitmany_id} AND aru_id=${aru_id}`);
}
exports.deleteFromRakomany = deleteFromRakomany;

const getRakomanyBySzallitmanyId = async (szallitmany_id) => {
    let [rows, fields] = await db.query(`SELECT nev, rakomany_id, szallitmany_id, rakomany.aru_id, mennyiseg FROM rakomany, aru WHERE aru.aru_id=rakomany.aru_id AND szallitmany_id=${szallitmany_id}`);
    return rows;
}
exports.getRakomanyBySzallitmanyId = getRakomanyBySzallitmanyId;

const getAruMennyisegBySzallitmanyIdAruId = async (szallitmany_id, aru_id) => {
    let [rows, fields] = await db.query(`SELECT mennyiseg FROM rakomany WHERE szallitmany_id=${szallitmany_id} AND aru_id=${aru_id}`);
    return rows;
}
exports.getAruMennyisegBySzallitmanyIdAruId = getAruMennyisegBySzallitmanyIdAruId;

const stat1 = async () => {
    let [rows, fields] = await db.query(`SELECT raktar.varos AS nev, count(felhasznalo.nev) AS mennyiseg FROM felhasznalo, raktar WHERE felhasznalo.raktar_id=raktar.raktar_id group by raktar.varos order by mennyiseg desc`);
    return rows;
}
exports.stat1 = stat1;

const stat2 = async () => {
    let [rows, fields] = await db.query(`SELECT concat(raktar.varos,", ", raktar.utca) as nev, raktar.kapacitas from raktar where raktar.kapacitas > (select avg(kapacitas) from raktar)`);
    return rows;
}
exports.stat2 = stat2;


