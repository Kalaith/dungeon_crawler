// Monster Manual JavaScript - Ultra Version

let allMonsters = [];
let filteredMonsters = [];
let globalAbilities = {};
let globalLegendary = {};

// Map short keys to display names
const SIZE_MAP = {
    'T': 'Tiny',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'H': 'Huge',
    'G': 'Gargantuan'
};

const ALIGN_MAP = {
    'LG': 'Lawful Good',
    'NG': 'Neutral Good',
    'CG': 'Chaotic Good',
    'LN': 'Lawful Neutral',
    'N': 'Neutral',
    'CN': 'Chaotic Neutral',
    'LE': 'Lawful Evil',
    'NE': 'Neutral Evil',
    'CE': 'Chaotic Evil',
    'U': 'Unaligned',
    'A': 'Any Alignment'
};

const SPEED_MAP = {
    'w': 'Walk',
    'f': 'Fly',
    's': 'Swim',
    'b': 'Burrow',
    'c': 'Climb'
};

const ABILITY_MAP = {
    'str': 'STR',
    'dex': 'DEX',
    'con': 'CON',
    'int': 'INT',
    'wis': 'WIS',
    'cha': 'CHA'
};

// Load monsters from JSON file
async function loadMonsters() {
    try {
        const response = await fetch('monsters_ultra.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Store global lookups
        globalAbilities = data.abilities || {};
        globalLegendary = data.legendary || {};

        // Process monsters
        allMonsters = data.monsters || [];
        filteredMonsters = [...allMonsters];

        populateFilters();
        displayMonsters();
        updateResultCount();
    } catch (error) {
        console.error('Error loading monsters:', error);
        document.getElementById('resultCount').textContent = 'Error loading monsters. Please check console/network.';
    }
}

// Populate filter dropdowns
function populateFilters() {
    const types = new Set();
    const sizes = new Set();
    const crs = new Set();
    const alignments = new Set();

    allMonsters.forEach(monster => {
        if (monster.type) types.add(monster.type);
        if (monster.size) sizes.add(monster.size);
        if (monster.cr !== undefined) crs.add(monster.cr);
        if (monster.align) alignments.add(monster.align);
    });

    populateSelect('typeFilter', Array.from(types).sort());

    // Sort sizes by standard order
    const sizeOrder = ['T', 'S', 'M', 'L', 'H', 'G'];
    populateSelect('sizeFilter', Array.from(sizes).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)), SIZE_MAP);

    populateSelect('crFilter', Array.from(crs).sort((a, b) => a - b));
    populateSelect('alignmentFilter', Array.from(alignments).sort(), ALIGN_MAP);
}

function populateSelect(id, options, map = null) {
    const select = document.getElementById(id);
    // Keep the first "All" option
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = map ? (map[option] || option) : option;
        select.appendChild(opt);
    });
}

// Display monsters
function displayMonsters() {
    const monsterList = document.getElementById('monsterList');
    monsterList.innerHTML = '';

    if (filteredMonsters.length === 0) {
        monsterList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No monsters found matching your criteria.</p>';
        return;
    }

    // Use a document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Limit display to first 50 to avoid lag if list is huge, implement infinite scroll if needed
    // For now, let's just show all or a large chunk. 
    // Given the user might want to see all, we'll render all but optimize.
    const displayLimit = 100;
    const monstersToShow = filteredMonsters.slice(0, displayLimit);

    monstersToShow.forEach(monster => {
        const card = createMonsterCard(monster);
        fragment.appendChild(card);
    });

    monsterList.appendChild(fragment);

    if (filteredMonsters.length > displayLimit) {
        const more = document.createElement('div');
        more.style.gridColumn = '1/-1';
        more.style.textAlign = 'center';
        more.style.padding = '20px';
        more.textContent = `And ${filteredMonsters.length - displayLimit} more... Use filters to narrow down.`;
        monsterList.appendChild(more);
    }
}

// Create monster card
function createMonsterCard(monster) {
    const card = document.createElement('div');
    card.className = 'monster-card';
    card.onclick = () => showMonsterDetail(monster);

    const hp = monster.hp || 'N/A';
    const ac = monster.ac || 'N/A';
    const cr = monster.cr !== undefined ? formatCR(monster.cr) : 'N/A';
    const size = SIZE_MAP[monster.size] || monster.size;
    const align = ALIGN_MAP[monster.align] || monster.align || 'Unaligned';

    card.innerHTML = `
        <h3>${monster.name}</h3>
        <div class="monster-meta">
            <strong>Type:</strong> ${size} ${monster.type}
        </div>
        <div class="monster-meta">
            <strong>Alignment:</strong> ${align}
        </div>
        <div class="monster-stats">
            <div class="stat-item">
                <span class="stat-label">AC</span>
                <span class="stat-value">${ac}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">HP</span>
                <span class="stat-value">${hp}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">CR</span>
                <span class="stat-value">${cr}</span>
            </div>
        </div>
    `;

    return card;
}

function formatCR(cr) {
    if (cr === 0.125) return '1/8';
    if (cr === 0.25) return '1/4';
    if (cr === 0.5) return '1/2';
    return cr;
}

// Calculate ability modifier
function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function formatModifier(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Resolve reference (ability or legendary)
function resolveRef(item, globalSource) {
    if (item.ref && globalSource[item.ref]) {
        // Merge the reference data with any overrides in the item
        return { ...globalSource[item.ref], ...item };
    }
    return item;
}

// Show monster detail modal
function showMonsterDetail(monster) {
    const modal = document.getElementById('monsterModal');
    const detailDiv = document.getElementById('monsterDetail');

    const size = SIZE_MAP[monster.size] || monster.size;
    const align = ALIGN_MAP[monster.align] || monster.align || 'Unaligned';

    let html = `
        <div class="monster-detail-header">
            <h2>${monster.name}</h2>
            <div class="monster-type-line">
                ${size} ${monster.type}, ${align}
            </div>
        </div>

        <div class="stat-block">
            <div class="monster-meta"><strong>Armor Class:</strong> ${monster.ac}</div>
            <div class="monster-meta"><strong>Hit Points:</strong> ${monster.hp}</div>
            <div class="monster-meta"><strong>Speed:</strong> ${formatSpeed(monster.spd)}</div>
        </div>

        <div class="ability-scores">
            ${renderAbilityScore('STR', monster.str)}
            ${renderAbilityScore('DEX', monster.dex)}
            ${renderAbilityScore('CON', monster.con)}
            ${renderAbilityScore('INT', monster.int)}
            ${renderAbilityScore('WIS', monster.wis)}
            ${renderAbilityScore('CHA', monster.cha)}
        </div>
    `;

    // RoA Attributes Section
    if (monster.attributes_roa) {
        const roa = monster.attributes_roa;
        const pos = roa.positive;
        const neg = roa.negative;
        const der = roa.derived;

        html += `
        <div class="detail-section" style="background: #f0f4f8; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <h3 style="margin-top:0; color: #2c3e50;">Realms of Arkania Stats</h3>
            <div class="ability-scores">
                ${renderRoAAttribute('CR', pos.CR)}
                ${renderRoAAttribute('WD', pos.WD)}
                ${renderRoAAttribute('IN', pos.IN)}
                ${renderRoAAttribute('CH', pos.CH)}
                ${renderRoAAttribute('DX', pos.DX)}
                ${renderRoAAttribute('AG', pos.AG)}
                ${renderRoAAttribute('ST', pos.ST)}
                ${renderRoAAttribute('CO', pos.CO)}
            </div>
            <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 5px; font-size: 0.9em;">
                <div title="Superstition">SN: ${neg.SN}</div>
                <div title="Acrophobia">AC: ${neg.AC}</div>
                <div title="Claustrophobia">CL: ${neg.CL}</div>
                <div title="Avarice">AV: ${neg.AV}</div>
                <div title="Necrophobia">NE: ${neg.NE}</div>
                <div title="Curiosity">CU: ${neg.CU}</div>
                <div title="Violent Temper">VT: ${neg.VT}</div>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;">
                <strong>Derived:</strong> 
                <span title="Armor Rating (0-11)">AR: ${der.AR}</span> | 
                <span title="Magic Resistance">MR: ${der.MR}</span> | 
                <span title="Life Points">LP: ${der.LP}</span>
            </div>
        </div>
        `;
    }

    html += `
        <div class="stat-block" style="margin-top: 15px;">
            <div class="monster-meta"><strong>Saving Throws:</strong> ${formatSaves(monster.sav)}</div>
            <div class="monster-meta"><strong>Skills:</strong> ${formatSkills(monster.ski)}</div>
            ${monster.imm ? `<div class="monster-meta"><strong>Immunities:</strong> ${monster.imm.join(', ')}</div>` : ''}
            ${monster.res ? `<div class="monster-meta"><strong>Resistances:</strong> ${monster.res.join(', ')}</div>` : ''}
            ${monster.vul ? `<div class="monster-meta"><strong>Vulnerabilities:</strong> ${monster.vul.join(', ')}</div>` : ''}
            ${monster.cond ? `<div class="monster-meta"><strong>Condition Immunities:</strong> ${monster.cond.join(', ')}</div>` : ''}
            <div class="monster-meta"><strong>Senses:</strong> ${monster.sen || 'Passive Perception ' + (10 + getModifier(monster.wis || 10))}</div>
            <div class="monster-meta"><strong>Languages:</strong> ${monster.lang || '—'}</div>
            <div class="monster-meta"><strong>Challenge:</strong> ${formatCR(monster.cr)}</div>
        </div>
    `;

    // Special Abilities
    if (monster.abi && monster.abi.length > 0) {
        html += `<div class="detail-section">
            <h3>Special Abilities</h3>`;
        monster.abi.forEach(item => {
            const ability = resolveRef(item, globalAbilities);
            html += `<div class="ability-item">
                <div class="ability-name-header">${ability.name}</div>
                <div class="ability-desc">${ability.desc}</div>
            </div>`;
        });
        html += `</div>`;
    }

    // Actions
    if (monster.act && monster.act.length > 0) {
        html += `<div class="detail-section">
            <h3>Actions</h3>`;
        monster.act.forEach(action => {
            html += `<div class="action-item">
                <div class="action-name">${action.name}${action.recharge ? ` (Recharge ${action.recharge}-6)` : ''}</div>
                <div class="action-desc">${action.desc || ''}</div>
                ${renderActionStats(action)}
            </div>`;
        });
        html += `</div>`;
    }

    // Legendary Actions
    if (monster.leg && monster.leg.length > 0) {
        html += `<div class="detail-section">
            <h3>Legendary Actions</h3>
            <div class="legendary-actions-note">
                The ${monster.name} can take 3 legendary actions, choosing from the options below. 
                Only one legendary action can be used at a time and only at the end of another creature's turn. 
                The ${monster.name} regains spent legendary actions at the start of its turn.
            </div>`;
        monster.leg.forEach(item => {
            const action = resolveRef(item, globalLegendary);
            html += `<div class="action-item">
                <div class="action-name">${action.name}</div>
                <div class="action-desc">${action.desc || ''}</div>
            </div>`;
        });
        html += `</div>`;
    }

    detailDiv.innerHTML = html;
    modal.style.display = 'block';
}

function renderAbilityScore(label, score) {
    const val = score || 10;
    return `
        <div class="ability-score">
            <span class="ability-name">${label}</span>
            <span class="ability-value">${val}</span>
            <span class="ability-modifier">(${formatModifier(getModifier(val))})</span>
        </div>
    `;
}

function renderRoAAttribute(label, val) {
    return `
        <div class="ability-score" style="background: #e1e8ed;">
            <span class="ability-name">${label}</span>
            <span class="ability-value">${val}</span>
        </div>
    `;
}

function formatSpeed(spd) {
    if (!spd) return 'N/A';
    return Object.entries(spd)
        .map(([k, v]) => `${SPEED_MAP[k] || k} ${v} ft.`)
        .join(', ');
}

function formatSaves(sav) {
    if (!sav) return '—';
    return Object.entries(sav)
        .map(([k, v]) => `${k.toUpperCase()} +${v}`)
        .join(', ');
}

function formatSkills(ski) {
    if (!ski) return '—';
    return Object.entries(ski)
        .map(([k, v]) => `${capitalize(k)} +${v}`)
        .join(', ');
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderActionStats(action) {
    let stats = '';
    if (action.attack) {
        stats += `<div class="damage-info">Attack Bonus: +${action.attack}</div>`;
    }
    if (action.damage) {
        const dmgStr = action.damage.map(d => `${d.dice} ${d.type}`).join(' + ');
        stats += `<div class="damage-info">Damage: ${dmgStr}</div>`;
    }
    if (action.save) {
        stats += `<div class="damage-info">Save: DC ${action.save.value} ${action.save.ability} (${action.save.success || 'none'})</div>`;
    }
    return stats;
}

// Filter and search functions
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
    const crFilter = document.getElementById('crFilter').value;
    const alignmentFilter = document.getElementById('alignmentFilter').value;

    filteredMonsters = allMonsters.filter(monster => {
        const matchesSearch = !searchTerm || monster.name.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || monster.type === typeFilter;
        const matchesSize = !sizeFilter || monster.size === sizeFilter;
        const matchesCR = !crFilter || monster.cr == crFilter;
        const matchesAlignment = !alignmentFilter || monster.align === alignmentFilter;

        return matchesSearch && matchesType && matchesSize && matchesCR && matchesAlignment;
    });

    displayMonsters();
    updateResultCount();
}

function updateResultCount() {
    const count = filteredMonsters.length;
    const total = allMonsters.length;
    document.getElementById('resultCount').textContent =
        `Showing ${count} of ${total} monster${total !== 1 ? 's' : ''}`;
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('sizeFilter').value = '';
    document.getElementById('crFilter').value = '';
    document.getElementById('alignmentFilter').value = '';
    applyFilters();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadMonsters();

    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('sizeFilter').addEventListener('change', applyFilters);
    document.getElementById('crFilter').addEventListener('change', applyFilters);
    document.getElementById('alignmentFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Modal close handlers
    const modal = document.getElementById('monsterModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
