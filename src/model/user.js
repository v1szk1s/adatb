const db = require("../config/database.js");

exports.addUser = async (email, nev, raktar_id, jelszo) => {
    await db.query(`INSERT INTO felhasznalo (email, nev, raktar_id, jelszo, role) VALUES ("${email}", "${nev}", ${raktar_id}, "${jelszo}", "USER")`);
    return true;
}

exports.editUser = async (id, nev, email, role, raktar_id) => {
    await db.query(`UPDATE felhasznalo SET nev = "${nev}", email = "${email}", role = "${role}", raktar_id=${raktar_id}  WHERE felhasznalo_id=${id}`);
}

exports.deleteUser = async (id) => {
    await db.query(`DELETE FROM felhasznalo WHERE felhasznalo_id=${id}`);
}

exports.getUserByEmail = async (email) => {
    let [rows, fields] = await db.query(`SELECT * FROM felhasznalo WHERE email="${email}"`);
    return rows[0];
}

exports.getAllFreeUser = async () => {
    let [rows, fields] = await db.query(`SELECT * FROM felhasznalo WHERE raktar_id IS NULL `);
    return rows;
}

exports.getAllRaktarUser = async () => {
    let [rows, fields] = await db.query(`SELECT felhasznalo.raktar_id, felhasznalo.felhasznalo_id, felhasznalo.nev, felhasznalo.email, felhasznalo.role ,CONCAT(raktar.varos,", " ,raktar.utca) as raktar from felhasznalo, raktar where felhasznalo.raktar_id = raktar.raktar_id`);
    return rows;
}

exports.updatePassword = async (email, uj_jelszo) => {
    await db.query(`UPDATE felhasznalo SET jelszo="${uj_jelszo}"  WHERE email="${email}"`);
}

exports.updateEmail = async (email, uj_email) => {
    await db.query(`UPDATE felhasznalo SET email="${uj_email}"  WHERE email="${email}"`);
}

exports.updateName = async (email, uj_nev) => {
    await db.query(`UPDATE felhasznalo SET nev="${uj_nev}"  WHERE email="${email}"`);
}

