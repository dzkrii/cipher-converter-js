/**
 * UAS KEAMANAN WEB MOBILE
 * ANGGOTA KELOMPOK:
 * 1. FATAHUL AHMAD DZIKRI
 * 2. PARRA DIANA AN'NUR
 * 3. YUDHI RISWANDI
 * 4. FINCE PUTRA JAYA HULU
 * 
 * ALGORITMA:
 * CAESAR CIPHER -> RAIL FENCE CIPHER -> AFFINE CIPHER
 */

// --- Caesar Cipher ---
function caesarEncrypt(text, key) {
    key = parseInt(key);
    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + key) % 26 + 26) % 26 + start);
        }
        return char;
    }).join('');
}

function caesarDecrypt(text, key) {
    return caesarEncrypt(text, -key);
}

// --- Rail Fence Cipher ---
function railFenceEncrypt(text, rails) {
    rails = parseInt(rails);
    if (rails <= 1) return text;

    const fence = Array.from({ length: rails }, () => []);
    let rail = 0;
    let direction = 1;

    for (const char of text) {
        fence[rail].push(char);
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
    }

    return fence.map(r => r.join('')).join('');
}

function railFenceDecrypt(cipher, rails) {
    rails = parseInt(rails);
    if (rails <= 1) return cipher;

    const length = cipher.length;
    const fence = Array.from({ length: rails }, () => Array(length).fill(null));

    let rail = 0;
    let direction = 1;
    for (let i = 0; i < length; i++) {
        fence[rail][i] = '*';
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
    }

    let index = 0;
    for (let r = 0; r < rails; r++) {
        for (let c = 0; c < length; c++) {
            if (fence[r][c] === '*' && index < length) {
                fence[r][c] = cipher[index++];
            }
        }
    }

    let result = '';
    rail = 0;
    direction = 1;
    for (let i = 0; i < length; i++) {
        result += fence[rail][i];
        rail += direction;
        if (rail === rails - 1 || rail === 0) direction *= -1;
    }
    return result;
}

// --- Affine Cipher ---
function affineEncrypt(text, a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const start = char <= 'Z' ? 65 : 97;
            const x = char.charCodeAt(0) - start;
            return String.fromCharCode(((a * x + b) % 26 + 26) % 26 + start);
        }
        return char;
    }).join('');
}

function affineDecrypt(text, a, b) {
    a = parseInt(a);
    b = parseInt(b);
    
    // Find modular inverse of a mod 26
    let aInv = -1;
    for (let i = 0; i < 26; i++) {
        if ((a * i) % 26 === 1) {
            aInv = i;
            break;
        }
    }
    
    if (aInv === -1) return text;

    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const start = char <= 'Z' ? 65 : 97;
            const y = char.charCodeAt(0) - start;
            return String.fromCharCode(((aInv * (y - b)) % 26 + 26) % 26 + start);
        }
        return char;
    }).join('');
}

// --- Orchestrator ---
function encryptCombined(text, caesarKey, railKey, affineA, affineB) {
    let res = caesarEncrypt(text, caesarKey);
    res = railFenceEncrypt(res, railKey);
    res = affineEncrypt(res, affineA, affineB);
    return res;
}

function decryptCombined(text, caesarKey, railKey, affineA, affineB) {
    let res = affineDecrypt(text, affineA, affineB);
    res = railFenceDecrypt(res, railKey);
    res = caesarDecrypt(res, caesarKey);
    return res;
}
