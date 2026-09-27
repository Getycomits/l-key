const VALID_KEYS = [
    "KEY_48291037", "KEY_71930582", "KEY_20485716", "KEY_96374102",
    "KEY_50817294", "KEY_38291647", "KEY_62480193", "KEY_17509328",
    "KEY_83920471", "KEY_40618275", "KEY_91827463", "KEY_57301928",
    "KEY_26473810", "KEY_70184925", "KEY_39571068", "KEY_84710293",
    "KEY_15293847", "KEY_63019472", "KEY_92837461", "KEY_48173920",
    "KEY_71928364", "KEY_20394817", "KEY_56482019", "KEY_91827364",
    "KEY_37829104", "KEY_64018392", "KEY_19746382", "KEY_82937461",
    "KEY_45190283", "KEY_73618294", "KEY_91827365", "KEY_28491736",
    "KEY_57492810", "KEY_19384726", "KEY_64829173", "KEY_37284910",
    "KEY_81927364", "KEY_40291837", "KEY_73649182", "KEY_19283746",
    "KEY_58492017", "KEY_91837264", "KEY_27481936", "KEY_63829147",
    "KEY_19374829", "KEY_82736491", "KEY_46518293", "KEY_73920184",
    "KEY_18293746", "KEY_59182736", "KEY_91847263", "KEY_28473619",
    "KEY_64719283", "KEY_39284710", "KEY_81726354", "KEY_45182930",
    "KEY_73619284", "KEY_19284736", "KEY_58392017", "KEY_91837462",
    "KEY_27463819", "KEY_63829174", "KEY_19384756", "KEY_82736419",
    "KEY_46518273", "KEY_73920164", "KEY_18293764", "KEY_59182734",
    "KEY_91847326", "KEY_28473691", "KEY_64719238", "KEY_39284761",
    "KEY_81726345", "KEY_45182937", "KEY_73619248", "KEY_19284763",
    "KEY_58392071", "KEY_91837642", "KEY_27463891", "KEY_63829147",
    "KEY_19384762", "KEY_82736451", "KEY_46518279", "KEY_73920168",
    "KEY_18293794", "KEY_59182746", "KEY_91847623", "KEY_28473647",
    "KEY_64719283", "KEY_39284719", "KEY_81726354", "KEY_45182976",
    "KEY_73619218", "KEY_19284729", "KEY_58392034", "KEY_91837647",
    "KEY_27463854", "KEY_63829119", "KEY_19384758", "KEY_82736412"
];

const STORAGE_USED = 'l_used_keys';
const STORAGE_MYKEY = 'l_my_key';
const STORAGE_USER = 'l_username';

function getUsedKeys() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_USED)) || [];
    } catch {
        return [];
    }
}

function markKeyAsUsed(key) {
    const used = getUsedKeys();
    if (!used.includes(key)) {
        used.push(key);
        localStorage.setItem(STORAGE_USED, JSON.stringify(used));
    }
}

function getAvailableKey() {
    const used = getUsedKeys();
    for (const key of VALID_KEYS) {
        if (!used.includes(key)) {
            return key;
        }
    }
    return null;
}

const BAD_WORDS = ['test', 'admin', 'mod', 'null', 'undefined'];

function isValidUsername(name) {
    if (!name || name.length < 3) return false;
    if (name.length > 30) return false;
    const lower = name.toLowerCase();
    for (const bad of BAD_WORDS) {
        if (lower === bad) return false;
    }
    return true;
}

const usernameInput = document.getElementById('username');
const generateBtn = document.getElementById('generateBtn');
const result = document.getElementById('result');
const keyOutput = document.getElementById('keyOutput');
const copyBtn = document.getElementById('copyBtn');

generateBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();

    if (!isValidUsername(username)) {
        usernameInput.style.borderColor = '#ff4444';
        usernameInput.placeholder = 'Nome inválido (mín. 3 letras)';
        setTimeout(() => {
            usernameInput.style.borderColor = '';
            usernameInput.placeholder = 'Digite seu nome de usuário';
        }, 2000);
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'GERANDO...';

    setTimeout(() => {
        const key = getAvailableKey();

        if (!key) {
            generateBtn.disabled = false;
            generateBtn.textContent = 'SEM KEYS DISPONÍVEIS';
            generateBtn.style.background = '#ff4444';
            generateBtn.style.color = '#fff';
            return;
        }

        markKeyAsUsed(key);
        keyOutput.textContent = key;
        result.classList.remove('hidden');
        void result.offsetWidth;
        result.classList.add('show');

        generateBtn.disabled = false;
        generateBtn.textContent = 'GERAR OUTRA KEY';

        localStorage.setItem(STORAGE_MYKEY, key);
        localStorage.setItem(STORAGE_USER, username);

        const used = getUsedKeys().length;
        const total = VALID_KEYS.length;
        document.querySelector('.result-label').textContent =
            `TUA KEY (${used}/${total} usadas):`;
    }, 800);
});

copyBtn.addEventListener('click', () => {
    const key = keyOutput.textContent;

    navigator.clipboard.writeText(key).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.borderColor = '#4f4';

        setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.style.borderColor = '#333';
        }, 1500);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = key;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyBtn.textContent = '✅';
        setTimeout(() => copyBtn.textContent = '📋', 1500);
    });
});

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem(STORAGE_MYKEY);
    const savedUser = localStorage.getItem(STORAGE_USER);

    if (savedKey && savedUser) {
        usernameInput.value = savedUser;
        keyOutput.textContent = savedKey;
        result.classList.remove('hidden');
        setTimeout(() => result.classList.add('show'), 100);
        generateBtn.textContent = 'GERAR OUTRA KEY';

        const used = getUsedKeys().length;
        const total = VALID_KEYS.length;
        document.querySelector('.result-label').textContent =
            `TUA KEY (${used}/${total} usadas):`;
    }
});