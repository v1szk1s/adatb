const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/auth').jwtSecret;
const auth = require('../config/auth').auth;
const express = require("express");
const db = require('../model/raktar');
const router = express.Router();
////////////////
// userek
//////////////

let counter = 0;
router.get("/", auth, async (req, res) => {
    return res.redirect('/raktar');
    let {curr_email, curr_role} = req.body;

    let siker = req.query.siker;

    counter++;
    if(counter !== 1)
        siker = false;

    return res.render('index',{
        siker: siker,
        email: curr_email,
        role: curr_role
    });
});

router.get("/register", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    const raktar = await db.getAllRaktar(); 

    return res.render('regist', {
        curr_role: curr_role,
        raktar: raktar,
        hiba: ""
    });
});

router.post("/register", auth,  async (req, res) => {
    const raktar = await db.getAllRaktar(); 
    let {email_cim, nev, jelszo, jelszo2, selected_raktar} = req.body;

    if(!email_cim && !nev && !jelszo && !jelszo2){
        return res.redirect('/register');
    }
    if(email_cim && nev && jelszo && jelszo2){
        const user = await db.getUserByEmail(email_cim);
        if(user){
            return res.render('regist', {
                raktar: raktar,
                hiba: "Iilyen email-cím már szerepel az adatbázisban!"
            });
        }
        if(jelszo !== jelszo2){
            return res.render('regist',{
                raktar: raktar,
                hiba: "A két jelszó nem egyezik!"
            });
        }
    }else{
        return res.render('regist', {
            raktar: raktar,
            hiba: "Kérem minden mezőt töltsön ki!"
        });
    }

    await bcrypt.hash(jelszo, 10).then(async(hash) => {
        await db.addUser(email_cim, nev, selected_raktar, hash);
    });
    return res.redirect('/users');
});

router.get("/login", async (req, res) => {
    return res.render('login', {
        email: "",
        hibak: []
    });
});

router.post("/login", async (req, res) => {
    let {email, jelszo} = req.body;
    if(!email && !jelszo){
        return res.redirect('/login');
    }

    if(!email || !jelszo){
        return res.render('login', {
            email: email,
            hibak: ["Kérem mindem mezőt töltsön ki!"]
        });
    }

    const user = await db.getUserByEmail(email);
    if(!user){
        return res.render('login', {
            email: email,
            hibak: ["Hibás felhasználónév vagy jelszó!"]
        });
    }

    bcrypt.compare(jelszo, user.jelszo).then(function(siker) {
        if (siker) {
            const token = jwt.sign({
                email: user.email,
                role: user.role
            },
                secret 
            );

            res.cookie("jwt", token, {
                httpOnly: true
            });
            return res.redirect('/?siker=true');
        }else{
            return res.render('login', {
                email: email,
                hibak: ["Hibás felhasználónév vagy jelszó!"]
            });
        }
    });

});

router.get("/logout", (req, res) => {
    res.cookie("jwt", "", {
        maxAge: "1"
    })
    return res.redirect("/")
});

router.get("/profile", auth, async (req, res) => {
    const {curr_email, curr_role} = req.body;
    const user = await db.getUserByEmail(curr_email);
    let raktar;
    if(user.raktar_id)
        raktar = await db.getRaktarNameById(user.raktar_id);
    return res.render('profile',{
        curr_role: curr_role,
        raktar_nev: raktar,
        user:user
    });
});

router.get("/changePassword", auth, async (req, res) => {
    let {curr_role} = req.body

    return res.render('changePassword', {
        curr_role: curr_role,
        hiba: ""
    });
});

router.post("/changePassword", auth, async (req, res) => {
   let {jelszo, jelszo2, curr_role, curr_email} = req.body; 

    if(!jelszo && !jelszo2)
        return res.redirect('/changePassword');

    if(jelszo !== jelszo2)
        return res.render('changePassword', {
            curr_role: curr_role,
            hiba: "A két jelszó nem egyezik!"
        });
    else
        await bcrypt.hash(jelszo, 10).then(async(hash) => {
            await db.updatePassword(curr_email, hash);
        });
    return res.redirect('profile');

});

router.get("/users", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    const raktar_user = await db.getAllRaktarUser(); 
    const free_user = await db.getAllFreeUser(); 
    let szerkeszt = req.query.szerkeszt;
    let felhasznalo_id = req.query.id;
    let raktar;
    if(felhasznalo_id){
        raktar = await db.getAllRaktar(); 
    }


    return res.render('userek', {
        felhasznalo_id: felhasznalo_id,
        raktar_user: raktar_user,
        free_user: free_user,
        raktar: raktar,
        szerkeszt: szerkeszt,
        curr_role: req.body.curr_role,
        curr_email: req.body.curr_email
    });
});

router.post("/editUser", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    let {felhasznalo_id, nev, email, role, selected_raktar} = req.body;
    if(felhasznalo_id, nev, email, role, selected_raktar){
        await db.editUser(felhasznalo_id, nev, email, role, selected_raktar);
    }
    return res.redirect('/users?szerkeszt=1');

});

router.post("/deleteUser", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    let {id} = req.body;
    await db.deleteUser(id);
  
    return res.redirect('users?szerkeszt=1');
});

///////////
// raktar
//////////

router.get("/raktar", auth, async (req, res) => {
    const {curr_email, curr_role} = req.body;

    const raktar = await db.getAllRaktar(); 
    let szerkeszt = req.query.szerkeszt;
    let id = req.query.id;
    let user;
    if(curr_role !== 'ADMIN'){
        user = await db.getUserByEmail(curr_email);
        szerkeszt = id = "";
    }

    return res.render('raktar', {
        user: user,
        curr_role: curr_role,
        id: id,
        raktar: raktar,
        szerkeszt: szerkeszt
    });
});

router.post("/raktar", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    let {varos, utca, kapacitas} = req.body;
    let hiba;
    if(!varos || !utca || !kapacitas){
        hiba = "Kérem minden mezőt töltsön ki!";
    }else if(isNaN(kapacitas)){
        hiba = "A kapacitas csak szám lehet!";
    }
    if(hiba){
        const raktar = await db.getAllRaktar(); 
        return res.render('raktar' ,{
            hiba:hiba,
            raktar: raktar
        });
    }
    await db.addRaktar(varos, utca, kapacitas);
  
    return res.redirect('/raktar');
});

router.post("/editRaktar", auth, async (req, res) => {
    const {curr_role, curr_email} = req.body;
    if(curr_role !== 'ADMIN' )
        return res.redirect('/raktar');
    let {id, varos, utca, kapacitas} = req.body;
    if(varos && utca && kapacitas){
        await db.editRaktar(id, varos, utca, kapacitas);
    }
    return res.redirect('/raktar?szerkeszt=1');

});

router.post("/deleteRaktar", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    let {id} = req.body;
    await db.deleteRaktar(id);
  
    return res.redirect('raktar?szerkeszt=1');
});

router.get("/viewRaktar", auth, async (req, res) => {
    const {curr_role, curr_email} = req.body;
    const user = await db.getUserByEmail(curr_email);
    let raktar_id = req.query.id;
    let sajat = raktar_id == user.raktar_id ? 1:0;
    let aru_id = req.query.aru_id;
    let szerkeszt = req.query.szerkeszt;
    const nev = await db.getRaktarNameById(raktar_id);
    const aruk = await db.getAllAruByRaktarId(raktar_id);
    const all_aru = await db.getAllAru(raktar_id);
    return res.render('viewRaktar',{
        sajat: sajat,
        curr_role: curr_role,
        szerkeszt: szerkeszt,
        raktar_id: raktar_id,
        aru_id: aru_id,
        nev: nev,
        aruk: aruk,
        all_aru: all_aru
    });
});

router.get("/sajatRaktar", auth, async (req, res) => {
    const {curr_role, curr_email} = req.body;
    const user = await db.getUserByEmail(curr_email);
    res.redirect(`viewRaktar?id=${user.raktar_id}`);
});

router.post("/addToKeszlet", auth, async (req, res) => {
    let {raktar_id, aru_id, db, curr_role, curr_email} = req.body;
    const user = await db.getUserByEmail(curr_email);
    if(curr_role !== 'ADMIN' && raktar_id != user.raktar_id){
        return res.redirect(`viewRaktar?id=${raktar_id}`);
    }

    if(isNaN(db) || db <= 0){
        if(req.headers.referer.split('/')[3] === 'sajatRaktar')
            return res.redirect(`sajatRaktar`);
        return res.redirect(`viewRaktar?id=${raktar_id}`);
    }

    await db.addToKeszlet(raktar_id, aru_id,db);
    if(req.headers.referer.split('/')[3] === 'sajatRaktar')
        return res.redirect(`sajatRaktar`);

    return res.redirect(`viewRaktar?id=${raktar_id}`);
});

router.post("/editKeszlet", auth, async (req, res) => {
    let {raktar_id, aru_id, mennyiseg, curr_email, curr_role} = req.body; 
    const user = await db.getUserByEmail(curr_email);

    if(curr_role !== 'ADMIN' && raktar_id != user.raktar_id){
        return res.redirect(`viewRaktar?id=${raktar_id}`);
    }

    if(isNaN(mennyiseg))
    return res.redirect(`viewRaktar?id=${raktar_id}&szerkeszt=1`);


    await db.editKeszlet(raktar_id, aru_id, mennyiseg);

    return res.redirect(`viewRaktar?id=${raktar_id}&szerkeszt=1`);
});

router.post("/deleteFromKeszlet", auth, async (req, res) => {
    let {aru_id, raktar_id, curr_email, curr_role} = req.body;
    const user = await db.getUserByEmail(curr_email);
    if(curr_role !== 'ADMIN' && raktar_id != user.raktar_id){
        return res.redirect(`viewRaktar?id=${raktar_id}`);
    }

    await db.deleteFromKeszlet(aru_id);

    return res.redirect(`viewRaktar?id=${raktar_id}&szerkeszt=1`);
});

////////////////
// aruk
///////////////

router.get("/aruk", auth, async (req, res) => {
    const {curr_role} = req.body;
    if(curr_role !== 'ADMIN')
        return res.redirect('/raktar');
    const aruk = await db.getAllAru();
    let szerkeszt = req.query.szerkeszt;
    let id = req.query.id;

    return res.render('aruk',{
        curr_role: curr_role,
        aruk: aruk,
        id: id,
        szerkeszt: szerkeszt
    });

});

router.post("/addAru", auth, async (req, res) => {
    let {nev, terfogat, suly, ar} = req.body; 
    if(isNaN(terfogat) || isNaN(suly) || isNaN(ar)){
        return res.redirect('/aruk');
    }
    await db.addAru(nev, terfogat, suly, ar);

    return res.redirect('/aruk');

});

router.post("/editAru", auth, async (req, res) => {
    let {aru_id, nev, terfogat, suly, ar} = req.body; 
    await db.editAru(aru_id, nev, terfogat, suly, ar);
    return res.redirect('/aruk?szerkeszt=1');

});

router.post("/deleteAru", auth, async (req, res) => {
    let {aru_id} = req.body;
    await db.deleteAru(aru_id);
    return res.redirect('aruk?szerkeszt=1');
});

router.get("/szallitmany", auth, async (req, res) => {
    let {curr_role} = req.body;
    let raktar; 
    const szallitmany = await db.getAllSzallitmany();
    if(curr_role === 'ADMIN'){
        raktar = await db.getAllRaktar();

    }
    let szerkeszt = req.query.szerkeszt;
    let id = req.query.id;

    return res.render('szallitmany',{
        curr_role: curr_role,
        raktar: raktar,
        szallitmany: szallitmany,
        id: id,
        szerkeszt: szerkeszt
    });

});

router.get("/ujSzallitmany", auth, async (req, res) => {
    let {curr_role, curr_email} = req.body;
    let {honnan_id} = req.query;
    let {rakomany} = req.cookies;

    if(!honnan_id)
        return res.redirect('/szallitmany');

    const raktar = await db.getAllRaktar();
    const aruk = await db.getAllAruByRaktarId(honnan_id);

    let rakomany_aru;

    if(rakomany && Object.keys(rakomany).length > 0){
        rakomany_aru = await db.getAllAruByIdArr(Object.keys(rakomany).join(', '));
        for(let i = 0; i < rakomany_aru.length; i++){
            rakomany_aru[i]['mennyiseg'] = rakomany[rakomany_aru[i]['aru_id']];

        }
    
    
        for(let i = 0; i < aruk.length; i++){
            for(let j of Object.keys(rakomany)){
                if(aruk[i].aru_id == j){
                    aruk[i]['mennyiseg'] -= rakomany[aruk[i]['aru_id']];
                }
            }
        }
    }
    return res.render('ujSzallitmany', {
        honnan_id: honnan_id,
        rakomany: rakomany_aru,
        curr_role: curr_role, 
        raktar: raktar,
        aruk: aruk

    });

});

router.post("/ujSzallitmany", auth, async (req, res) => {
    let {curr_role, curr_email, honnan_id, hova_id} = req.body;
    let {rakomany} = req.cookies;

    let time = new Date().toLocaleString('hu', {timeZone: 'Europe/Athens'}).replace('. ','-').replace('. ','-').replace('. ',' ');
    await db.addSzallitmany(time, curr_email, honnan_id, hova_id);
    const szallitmany_id = (await db.getAllSzallitmanyIdByDate(time)).szallitmany_id;
    for(i of Object.keys(rakomany)){
        db.addToRakomany(szallitmany_id, i, rakomany[i]);
    }
    res.cookie("rakomany", '', {
        httpOnly: true
    });
    return res.redirect('szallitmany');
});

router.post("/editSzallitmany", auth, async (req, res) => {
    let {szallitmany_id, honnan_id, hova_id} = req.body;
    await db.editSzallitmany(szallitmany_id, honnan_id, hova_id);
    
    res.redirect('/szallitmany?szerkeszt=1');

});

router.post("/deleteSzallitmany", auth, async (req, res) => {
    let {del_id} = req.body;

    await db.deleteSzallitmany(del_id);
    
    res.redirect('/szallitmany?szerkeszt=1');
});

router.post("/addToRakomany", auth, async (req, res) => {
    let {honnan_id, aru_id, mennyiseg} = req.body;
    let {rakomany} = req.cookies;
    
    if(!rakomany)
        rakomany = {};
    if(rakomany[aru_id] == null){
        rakomany[aru_id] = 1;
    }else
        rakomany[aru_id] = +mennyiseg+rakomany[aru_id];

    res.cookie("rakomany", rakomany, {
        httpOnly: true
    });
    return res.redirect(`/ujSzallitmany?honnan_id=${honnan_id}`);

});

router.post("/editRakomany", auth, async (req, res) => {
    let {honnan_id, aru_id, mennyiseg} = req.body;
    let {rakomany} = req.cookies;
    rakomany[aru_id] = +mennyiseg;

    res.cookie("rakomany", rakomany, {
        httpOnly: true
    });
    return res.redirect(`/ujSzallitmany?honnan_id=${honnan_id}`);

});

router.post("/editRakomanyUtolag", auth, async (req, res) => {
    let {szallitmany_id, aru_id, mennyiseg} = req.body;

    await db.editRakomany(szallitmany_id, aru_id, mennyiseg);

    return res.redirect(`/viewRakomany?id=${szallitmany_id}&szerkeszt=1`);
});

router.post("/addToRakomanyUtolag", auth, async (req, res) => {
    let {szallitmany_id, aru_id} = req.body;

    let jelenlegi = await db.getAruMennyisegBySzallitmanyIdAruId(szallitmany_id, aru_id);
    console.log(jelenlegi);


    if(jelenlegi.length == 0)
        await db.addToRakomany(szallitmany_id, aru_id, 1);
    else
        await db.editRakomany(szallitmany_id, aru_id, jelenlegi[0].mennyiseg+1);

    return res.redirect(`/viewRakomany?id=${szallitmany_id}&szerkeszt=1`);
});

router.get("/torolFromRakomany", auth, async (req, res) => {
    let {honnan_id, aru_id} = req.query;
    let {rakomany} = req.cookies;
    delete rakomany[aru_id];

    res.cookie("rakomany", rakomany, {
        httpOnly: true
    });
    return res.redirect(`/ujSzallitmany?honnan_id=${honnan_id}&szerkeszt=1`);

});

router.get("/torolFromRakomanyUtolag", auth, async (req, res) => {
    let {szallitmany_id, aru_id} = req.query;

    await db.deleteFromRakomany(szallitmany_id, aru_id);


    return res.redirect(`/viewRakomany?id=${szallitmany_id}&szerkeszt=1`);

});

router.get("/viewRakomany", auth, async (req, res) => {
    let {curr_role} = req.body;
    let {id, szerkeszt} = req.query;
    console.log(id);

    const aruk = await db.getAllAru();
    const rakomany = await db.getRakomanyBySzallitmanyId(id);

    return res.render('viewRakomany',{
        szallitmany_id: id,
        szerkeszt: szerkeszt,
        curr_role: curr_role,
        rakomany: rakomany,
        aruk: aruk
    });

});

module.exports = router;
