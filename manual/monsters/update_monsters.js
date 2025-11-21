const fs = require('fs');
const path = require('path');

const monstersPath = path.join(__dirname, 'monsters_ultra.json');

try {
    const rawData = fs.readFileSync(monstersPath, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.monsters) {
        console.error("No monsters array found!");
        process.exit(1);
    }

    console.log(`Processing ${data.monsters.length} monsters...`);

    data.monsters.forEach(m => {
        // Helper to get stat or default to 10
        const getStat = (val) => val || 10;

        // D&D Stats
        const str = getStat(m.str);
        const dex = getStat(m.dex);
        const con = getStat(m.con);
        const int = getStat(m.int);
        const wis = getStat(m.wis);
        const cha = getStat(m.cha);

        // Scaling Function: D&D (1-30) -> RoA (1-20)
        // RoA Base is ~8. D&D Base is 10.
        // 10 -> 8
        // 20 -> 14
        // 30 -> 20
        const scale = (val) => {
            if (val < 10) return Math.max(1, Math.floor(val * 0.8)); // 1->1, 9->7
            return Math.min(20, Math.floor(8 + (val - 10) * 0.6));
        };

        // Positive Attributes
        const roa_st = scale(str);
        const roa_dx = scale(dex);
        const roa_ag = scale(dex); // Agility similar to Dex
        const roa_it = scale(int);
        const roa_wd = scale(wis);
        const roa_in = scale(wis); // Intuition similar to Wis
        const roa_ch = scale(cha);
        const roa_cr = scale((wis + cha) / 2); // Courage mix of Wis/Cha

        // Negative Attributes (Randomized 2-8, weighted by type/align could be added later)
        // For now, simple random 2-8
        const randNeg = () => Math.floor(Math.random() * 7) + 2;

        const roa_sn = randNeg(); // Superstition
        const roa_ac_fear = randNeg(); // Acrophobia
        const roa_cl = randNeg(); // Claustrophobia
        const roa_av = randNeg(); // Avarice
        const roa_ne = randNeg(); // Necrophobia
        const roa_cu = randNeg(); // Curiosity
        const roa_vt = randNeg(); // Violent Temper

        // Adjust Negatives based on Type (Flavor)
        if (m.type === 'dragon') {
            // Dragons are greedy
            m.avarice = Math.min(12, roa_av + 4);
        }
        if (m.type === 'undead') {
            // Undead don't fear death
            m.necrophobia = 0;
        }
        if (m.align && m.align.includes('C')) {
            // Chaotic often violent
            m.violent_temper = Math.min(10, roa_vt + 2);
        }

        // Derived Stats
        // AR: D&D AC 10 -> 0, 20 -> 5, 30 -> 10.
        const dnd_ac = m.ac || 10;
        const roa_ar = Math.max(0, Math.min(11, Math.floor((dnd_ac - 10) / 2)));

        // MR: Magic Resistance
        const roa_mr = Math.floor((roa_cr + roa_wd + roa_sn) / 3);

        // Store New Attributes
        m.attributes_roa = {
            positive: {
                CR: roa_cr,
                WD: roa_wd,
                IT: roa_it,
                CH: roa_ch,
                DX: roa_dx,
                AG: roa_ag,
                ST: roa_st,
                IN: roa_in,
                CO: scale(con) // Added Constitution as requested
            },
            negative: {
                SN: roa_sn,
                AC: roa_ac_fear,
                CL: roa_cl,
                AV: m.avarice || roa_av,
                NE: m.necrophobia !== undefined ? m.necrophobia : roa_ne,
                CU: roa_cu,
                VT: m.violent_temper || roa_vt
            },
            derived: {
                AR: roa_ar,
                MR: roa_mr,
                LP: m.hp // Life Points = HP
            }
        };

        // Update root properties if needed, but keeping them in a separate object is safer for now.
        // However, to "fix" the conflict, we might want to expose these at the top level eventually.
        // For this script, we'll just add the object.
    });

    fs.writeFileSync(monstersPath, JSON.stringify(data, null, 2));
    console.log("Monsters updated successfully!");

} catch (err) {
    console.error("Error updating monsters:", err);
}
