const _FUN_1_1_HELPER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const _FUN_1_2_HELPER = ['A', 'B', 'C', 'D'];
const _FUN_1_3_HELPER = ['A', 'B', 'C'];
const _FUN_1_4_HELPER = ['A', 'B', 'C'];
const _FUN_1_5_HELPER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'g', 'H', 'I'];
const _FUN_1_6_HELPER = ['A', 'B', 'C', 'D'];
const _FUN_1_7_HELPER = ['A', 'B', 'C'];
const _FUN_1_8_HELPER = ['A', 'B', 'C'];
const _FUN_1_9_HELPER = ['A', 'B'];
const _FUN_1_101_HELPER = ['A', 'B', 'C'];
const _FUN_1_102_HELPER = ['A', 'B', 'C', 'D'];
const _FUN_2_4_HELPER = ['A', 'B', 'C'];
const _FUN_2_5_HELPER = ['A', 'B'];

const _FUN_1_1 = (useLeter, lang) => {
    let letters = _FUN_1_1_HELPER
    let trn = {
        en: ['URBAN LICENSE',
            'PARCELLING LICENSE',
            'SUBDIVISION LICENSE',
            'CONSTRUCTION LICENSE',
            'PUBLIC SPACE INTERVENTION AND OCUPATION',
            'BUILDING ACKNOWLEDGEMENT',
            'OTHER PROCESS'],
        es: ['LICENCIA DE URBANIZACION',
            'LICENCIA DE PARCELACION',
            'LICENCIA DE SUBDIVISION',
            'LICENCIA DE CONSTRUCCION',
            'INTERVENCION Y OCUPACION DEL ESPACIO PUBLICO',
            'RECONOCIMIENTO DE LA EXISTENCIA DE UNA EDIFICACION',
            'OTRAS ACTUACIONES']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_2 = (useLeter, lang) => {
    let letters = _FUN_1_2_HELPER
    let trn = {
        en: ['INITIAL',
            'EXTENSION',
            'VALID LICENSE MODIFICATION',
            'REVALIDATION'],
        es: ['INICIAL',
            'PRORROGA',
            'MODIFICACION DE LICENCIA VIGENTE',
            'REVALIDACION']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_3 = (useLeter, lang) => {
    let letters = _FUN_1_3_HELPER
    let trn = {
        en: ['DEVELOPMENT',
            'SANITATION',
            'RECLAMATION'],
        es: ['DESARROLLO',
            'SANEAMIENTO',
            'RECUPERACION']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_4 = (useLeter, lang) => {
    let letters = _FUN_1_4_HELPER
    let trn = {
        en: ['RURAL SUBDIVISION',
            'URBAN SUBDIVISION',
            'REBATCHING'],
        es: ['SUBDIVISION RURAL',
            'SUBDIVISION URBANA',
            'RELOTEO']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_5 = (useLeter, lang) => {
    let letters = _FUN_1_5_HELPER
    let trn = {
        en: ['NEW CONSTRUCTION',
            'AMPLIATION',
            'ADEQUACY',
            'MODIFICATION',
            'RESTORATION',
            'STRUCTURAL REINFORCEMENT',
            'TOTAL DEMOLITION',
            'PARTIAL DEMOLITION',
            'RECONSTRUCTION',
            'ENCLOSURE'],
        es: ['OBRA NUEVA',
            'AMPLIACION',
            'ADECUACION',
            'MODIFICACION',
            'RESTAURACION',
            'REFORZAMIENTO ESTRUCTURAL',
            'DEMOLICION TOTAL',
            'DEMOLICION PARCIAL',
            'RECONSTRUCCION',
            'CERRAMIENTO']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_6 = (useLeter, lang) => {
    let letters = _FUN_1_6_HELPER
    let trn = {
        en: ['RESIDENCE',
            'TRADE AND/OR SERVICES',
            'INSTITUTIONAL',
            'INDUSTRIAL'],
        es: ['VIVIENDA',
            'COMERCIO Y/O SERVICIOS',
            'INSTITUCIONAL',
            'INDUSTRIAL']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_7 = (useLeter, lang) => {
    let letters = _FUN_1_7_HELPER
    let trn = {
        en: ['LESS THAN 2000 m2',
            'EQUAL OR MORE THAN 2000 m2',
            'REACHES OR SURPASSES THE AREA OF 2000 m2 THROUGH AMPLIATION'],
        es: ['MENOR A 2000 m2',
            'IGUAL O MAYOR A 2000 m2',
            'ALCANZA O SUPERA MEDIANTE AMPLIACION LOS 2000 m2']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_8 = (useLeter, lang) => {
    let letters = _FUN_1_8_HELPER
    let trn = {
        en: ['PIR',
            'SIR',
            'NO SIR'],
        es: ['VIP',
            'VIS',
            'NO VIS']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_9 = (useLeter, lang) => {
    let letters = _FUN_1_9_HELPER
    let trn = {
        en: ['YES',
            'NO'],
        es: ['SI',
            'NO']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_101 = (useLeter, lang) => {
    let letters = _FUN_1_101_HELPER
    let trn = {
        en: ['PASSIVE MEASURES',
            'ACTIVE MEASURES',
            'PASSIVE AND ACTIVE MEASURES'],
        es: ['MEDIDAS PASIVAS',
            'MEDIDAS ACTIVAS',
            'MEDIDAS ACTIVAS Y PASIVAS']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_1_102 = (useLeter, lang) => {
    let letters = _FUN_1_102_HELPER
    let trn = {
        en: ['COLD',
            'TEMPERATE',
            'WARM DRY',
            'WARM HUMID'],
        es: ['FRIO',
            'TEMPLADO',
            'CALIDO SECO',
            'CALIDO HUMEDO']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

const _FUN_2_4 = (useLeter, lang) => {
    let letters = _FUN_2_4_HELPER
    let trn = {
        en: ['URBAN',
            'RURAL',
            'EXPANTION'],
        es: ['URBANO',
            'RURAL',
            'DE EXPANSION']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};


const _FUN_2_5 = (useLeter, lang) => {
    let letters = _FUN_2_5_HELPER
    let trn = {
        en: ['LOT PLAN',
            'TOPOGRAPHIC MAP'],
        es: ['LANO DE LOTEO',
            'PLANO TOPOGRAFICO']
    }
    if (useLeter) {
        let array = trn[lang || 'en'];
        array = array.map((a, i) => `${letters[i]}. ${a}`)
        return array;
    }
    else return trn[lang || 'en']
};

exports.formsParser1 = (object, lang) => {
    if (!object) return "";
    let f_11 = object.tipo ? object.tipo : "";
    let f_12 = object.tramite ? object.tramite : "";
    let f_13 = object.m_urb ? object.m_urb : "";
    let f_14 = object.m_sub ? object.m_sub : "";
    let f_15 = object.m_lic ? object.m_lic : "";

    let textToParse = [];
    let arrayHelper = null;
    let arrayHelper2 = null;
    let defaultValue = null;

    // 1.1 CAN BE MULTIPLE
    defaultValue = f_11
    arrayHelper = _FUN_1_1(false, lang);
    arrayHelper2 = _FUN_1_1_HELPER;
    for (var i = 0; i < defaultValue.length; i++) {
        for (var j = 0; j < arrayHelper2.length; j++) {
            if (arrayHelper2[j] == defaultValue[i]) {
                textToParse.push(arrayHelper[j]);
            }
        }
    }

    // 1.2 CAN HAVE OTHER OPTIONS
    arrayHelper = _FUN_1_2(false, lang);
    arrayHelper2 = _FUN_1_2_HELPER;
    defaultValue = f_12;
    for (var i = 0; i < arrayHelper2.length; i++) {
        if (arrayHelper2[i] == defaultValue) {
            defaultValue = arrayHelper[i];
            break;
        }
    }
    if (defaultValue) {
        textToParse.push(defaultValue);
    }


    // 1.3 CAN BE NULL
    defaultValue = f_13
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_3(false, lang);
        arrayHelper2 = _FUN_1_3_HELPER;
        for (var i = 0; i < arrayHelper2.length; i++) {
            if (arrayHelper2[i] == defaultValue) {
                textToParse.push(arrayHelper[j]);
                break;
            }
        }
    }

    // 1.4 CAN BE NULL
    defaultValue = f_14
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_4(false, lang);
        arrayHelper2 = _FUN_1_4_HELPER;
        for (var i = 0; i < arrayHelper2.length; i++) {
            if (arrayHelper2[i] == defaultValue) {
                textToParse.push(arrayHelper[j]);
                break;
            }
        }
    }

    // 1.5 CAN BE NULL && CAN BE MULTILPLE
    defaultValue = f_15
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_5(false, lang);
        arrayHelper2 = _FUN_1_5_HELPER;
        for (var i = 0; i < defaultValue.length; i++) {
            for (var j = 0; j < arrayHelper2.length; j++) {
                if (arrayHelper2[j] == defaultValue[i]) {
                    textToParse.push(arrayHelper[j]);
                }
            }
        }
    }
    var striing = textToParse.join()
    return striing.replace(/,/g, ", ").toUpperCase();
}

exports.formsParser1_exlucde2 = (object, lang) => {
    if (!object) return "";
    let f_11 = object.tipo ? object.tipo : "";
    let f_12 = object.tramite ? object.tramite : "";
    let f_13 = object.m_urb ? object.m_urb : "";
    let f_14 = object.m_sub ? object.m_sub : "";
    let f_15 = object.m_lic ? object.m_lic : "";

    let textToParse = [];
    let arrayHelper = null;
    let arrayHelper2 = null;
    let defaultValue = null;

    // 1.1 CAN BE MULTIPLE
    defaultValue = f_11
    arrayHelper = _FUN_1_1(false, lang);
    arrayHelper2 = _FUN_1_1_HELPER;
    for (var i = 0; i < defaultValue.length; i++) {
        for (var j = 0; j < arrayHelper2.length; j++) {
            if (arrayHelper2[j] == defaultValue[i]) {
                textToParse.push(arrayHelper[j]);
            }
        }
    }


    // 1.3 CAN BE NULL
    defaultValue = f_13
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_3(false, lang);
        arrayHelper2 = _FUN_1_3_HELPER;
        for (var i = 0; i < arrayHelper2.length; i++) {
            if (arrayHelper2[i] == defaultValue) {
                textToParse.push(arrayHelper[j]);
                break;
            }
        }
    }

    // 1.4 CAN BE NULL
    defaultValue = f_14
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_4(false, lang);
        arrayHelper2 = _FUN_1_4_HELPER;
        for (var i = 0; i < arrayHelper2.length; i++) {
            if (arrayHelper2[i] == defaultValue) {
                textToParse.push(arrayHelper[j]);
                break;
            }
        }
    }

    // 1.5 CAN BE NULL && CAN BE MULTILPLE
    defaultValue = f_15
    if (defaultValue != "" && defaultValue != null) {
        arrayHelper = _FUN_1_5(false, lang);
        arrayHelper2 = _FUN_1_5_HELPER;
        for (var i = 0; i < defaultValue.length; i++) {
            for (var j = 0; j < arrayHelper2.length; j++) {
                if (arrayHelper2[j] == defaultValue[i]) {
                    textToParse.push(arrayHelper[j]);
                }
            }
        }
    }

    var striing = textToParse.join()
    return striing.replace(/,/g, ", ").toUpperCase();
}