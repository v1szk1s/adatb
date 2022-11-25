const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secret = require('../config/auth').jwtSecret;
const auth = require('../config/auth').auth;
const express = require("express");
const raktardb = require('../model/raktar');
const userdb = require('../model/user');

const router = express.Router();
////////////////
// userek
//////////////

let counter = 0;
router.get("/", auth, async (req, res) => {
    return res.redirect('/raktarok');
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
    const raktar = await raktardb.getAllRaktar(); 

    return res.render('regist', {
        raktar: raktar,
        hiba: ""
    });
});

router.post("/register", auth,  async (req, res) => {
    const raktar = await raktardb.getAllRaktar(); 
    let {email_cim, nev, jelszo, jelszo2, selected_raktar} = req.body;

    if(!email_cim && !nev && !jelszo && !jelszo2){
        return res.redirect('/register');
    }
    if(email_cim && nev && jelszo && jelszo2){
        const user = await userdb.getUserByEmail(email_cim);
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
        await userdb.addUser(email_cim, nev, selected_raktar, hash);
    });
    res.redirect('/users');
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

    const user = await userdb.getUserByEmail(email);
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
    counter = 0;
    res.redirect("/")
});

router.get("/users", auth, async (req, res) => {
    const raktar_user = await userdb.getAllRaktarUser(); 
    const free_user = await userdb.getAllFreeUser(); 
    let szerkeszt = req.query.szerkeszt;
    let felhasznalo_id = req.query.id;
    let raktar;
    if(felhasznalo_id){
        raktar = await raktardb.getAllRaktar(); 
    }


    return res.render('userek', {
        felhasznalo_id: felhasznalo_id,
        raktar_user: raktar_user,
        free_user: free_user,
        raktar: raktar,
        szerkeszt: szerkeszt,
        curr_role: req.body.curr_role
    });
});

router.post("/editUser", auth, async (req, res) => {
    let {felhasznalo_id, nev, email, role, selected_raktar} = req.body;
    if(felhasznalo_id, nev, email, role, selected_raktar){
        await userdb.editUser(felhasznalo_id, nev, email, role, selected_raktar);
    }
    res.redirect('/users?szerkeszt=1');

});

router.post("/deleteUser", auth, async (req, res) => {
    let {id} = req.body;
    await userdb.deleteUser(id);
  
    return res.redirect('users?szerkeszt=1');
});

///////////
// Raktarok
//////////

router.get("/raktarok", auth, async (req, res) => {
    const raktar = await raktardb.getAllRaktar(); 
    let szerkeszt = req.query.szerkeszt;
    let id = req.query.id;

    return res.render('raktarok', {
        id: id,
        raktar: raktar,
        szerkeszt: szerkeszt
    });
});

router.post("/raktarok", auth, async (req, res) => {
    let {varos, utca, kapacitas} = req.body;
    let hiba;
    if(!varos || !utca || !kapacitas){
        hiba = "Kérem minden mezőt töltsön ki!";
    }else if(isNaN(kapacitas)){
        hiba = "A kapacitas csak szám lehet!";
    }
    if(hiba){
        const raktar = await raktardb.getAllRaktar(); 
        return res.render('raktarok' ,{
            hiba:hiba,
            raktar: raktar
        });
    }
    await raktardb.addRaktar(varos, utca, kapacitas);
  
    return res.redirect('/raktarok');
});

router.post("/editRaktar", auth, async (req, res) => {
    let {id, varos, utca, kapacitas} = req.body;
    if(varos && utca && kapacitas){
        await raktardb.editRaktar(id, varos, utca, kapacitas);
    }
    res.redirect('/raktarok?szerkeszt=1');

});

router.post("/deleteRaktar", auth, async (req, res) => {
    let {id} = req.body;
    await raktardb.deleteRaktar(id);
  
    return res.redirect('raktarok?szerkeszt=1');
});

router.get("/viewRaktar", auth, async (req, res) => {
    let raktar_id = req.query.id;
    let szerkeszt = req.query.szerkeszt;
    const nev = await raktardb.getRaktarNameById(raktar_id);
    const aruk = await raktardb.getAllAruByRaktarId(raktar_id);
    const all_aru = await raktardb.getAllAru(raktar_id);
    res.render('viewRaktar',{
        szerkeszt: szerkeszt,
        raktar_id: raktar_id,
        nev: nev,
        aruk: aruk,
        all_aru: all_aru
    });

});

router.post("/addAruToRaktar", auth, async (req, res) => {
    let {selected_rakter_id, selected_aru_id, db} = req.body;
    //await raktardb.addToKeszlet(selected_rakter_id, selected_aru_id, db);
    await raktardb.addToKeszlet(1,2,3);

    return res.redirect(`viewRaktar?id=${selected_rakter_id}`);
});

router.post("/deleteFromKeszlet", auth, async (req, res) => {
    let {aru_id} = req.body;

    await raktardb.deleteFromKeszlet(aru_id);

    return res.redirect
}

////////////////
// aruk
///////////////

router.get("/aruk", auth, async (req, res) => {
    const aruk = await raktardb.getAllAru();
    let szerkeszt = req.query.szerkeszt;
    let id = req.query.id;

    return res.render('aruk',{
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
    await raktardb.addAru(nev, terfogat, suly, ar);

    return res.redirect('/aruk');

});

router.post("/editAru", auth, async (req, res) => {
    let {aru_id, nev, terfogat, suly, ar} = req.body; 
    await raktardb.editAru(aru_id, nev, terfogat, suly, ar);
    return res.redirect('/aruk?szerkeszt=1');

});

router.post("/deleteAru", auth, async (req, res) => {
    let {aru_id} = req.body;
    await raktardb.deleteAru(aru_id);
    return res.redirect('aruk?szerkeszt=1');
});


module.exports = router;
