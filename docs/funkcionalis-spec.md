a Havervagy tart klikkmentes bulikat (no-clique party). ez a következőképpen néz ki: vannak felhasználók egy appban, akik regisztrálnak az eseményre, bejelölik hogy ott vannak, minket onnantól érdekel. úgy működik, hogy 10 percenként másik asztalhoz sorsol mindenkit egy webapp, így nagyon sok emberrel találkozhatnak / kapcsolódhatnak - válthatnak pár szót a résztvevők. 
a felhasználóbázis adott, de a fejlesztés során számoljunk a következő tesztadatokkal: 1 rendezvény, 40 résztvevő, 10 asztal, de mindegyikhez csak 4 fő ülhet.  5 kör van minden rendezvényen. 

a felület a következőképpen működik:
- űrlap, ahol a felhasználó beírhatja a nevét, majd a "start" gombra kattint
- az alkalmazás értesítést küld neki, hogy melyik asztalhoz kell leülnie, és amikor lezárult egy kör. 
- az utolsó kör után mindenki kap egy üzenetet: "köszi, hogy eljöttél"
- az üzenetek nem kell azonnal megjelenjenek a mostani DEMO frontenden, majd a felhasználó ráfrissít az oldalra

A backend viszont úgy működik, hogy egy belépési pontot a szerver minden percben elindít, és tudnia kell, hogy 
- hol tartanak a körök
- ki-kivel ült már egy asztalnál
- kell-e az adott percben értesítéseket küldeni, kinek, milyen szöveggel. 