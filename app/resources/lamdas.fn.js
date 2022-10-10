exports.GET_JSON_FULL = (objec) => {
    if (!objec) return {};
    let json = objec;
    let whileSafeBreaker = 0;
    while (typeof json !== 'object') {
        try {
            json = JSON.parse(json)
        } catch (error) {
            return false;
        }
        whileSafeBreaker++
        if (whileSafeBreaker == 10) return false;
    }
    return json
}

exports.GET_FUN_STATE= (state, _lang) => {
    let lang = _lang || 'en';
    let trn = {
        en: {
            desj: 'DESISTED (Execution)',
            inc: 'INCOPLETE',
            ldf: 'LEGALLY SUBMITTED',
            exp: 'ISSUING',
            close: 'ISSUED',
            arch: 'ISSUED',
            close0: 'DESISTED',
            close1: 'DESISTED (Incomplete)',
            close2: 'DESISTED (Not present sign)',
            close3: 'DESISTED (Not corrected act)',
            close4: 'DESISTED (Not payed)',
            close5: 'DESISTED (Voluntary)',
        },
        es: {
            desj: 'DESISTIDO (Ejecución)',
            inc: 'INCOMPLETO',
            ldf: 'LEGAL Y DEBIDA FORMA',
            exp: 'EXPEDICIÓN',
            close: 'EXPEDIDO',
            arch: 'EXPEDIDO',
            close0: 'DESISTIDO',
            close1: 'DESISTIDO (Incompleto)',
            close2: 'DESISTIDO (No radicó valla)',
            close3: 'DESISTIDO (No subsanó Acta)',
            close4: 'DESISTIDO (No radicó pagos)',
            close5: 'DESISTIDO (Voluntario)',
        }
    }

    if (state < '-1') return trn[lang].desj 
    if (state == '-1') return trn[lang].inc
    if (state == '1') return trn[lang].inc
    if (state == '5') return trn[lang].ldf
    if (state == '50') return trn[lang].exp
    if (state == '100') return trn[lang].close
    if (state == '101') return trn[lang].arch
    if (state == '200') return trn[lang].close0 
    if (state == '201') return trn[lang].close1 
    if (state == '202') return trn[lang].close2 
    if (state == '203') return trn[lang].close3
    if (state == '204') return trn[lang].close4
    if (state == '205') return trn[lang].close5
    return ''
}

exports.FORMAT_NUMBER = (num, separator = '.') => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + separator)
}

exports.convertBase = (value, from_base, to_base) => {
    var range = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'.split('');
    var from_range = range.slice(0, from_base);
    var to_range = range.slice(0, to_base);

    var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
        if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + from_base + '.');
        return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
    }, 0);

    var new_value = '';
    while (dec_value > 0) {
        new_value = to_range[dec_value % to_base] + new_value;
        dec_value = (dec_value - (dec_value % to_base)) / to_base;
    }
    return new_value || '0';
}