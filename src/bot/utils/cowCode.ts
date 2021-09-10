type HexadecimooChar = 'o' | 'O' | 'о' | 'О' | 'ᴏ' | 'ⲟ' | 'Ⲟ' | 'ꓳ' | '𝚘' | '𝙾' | '𐊫' | '𐌏' | '𐐄' | '𐐬' | '𐓪' | '𐓂';

type HexadecimalChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

const hexToMoo: Record<HexadecimalChar,HexadecimooChar> = {
    '0': 'o',
    '1': 'O',
    '2': 'о',
    '3': 'О',
    '4': 'ᴏ',
    '5': 'ⲟ',
    '6': 'Ⲟ',
    '7': 'ꓳ',
    '8': '𝚘',
    '9': '𝙾',
    'A': '𐊫',
    'B': '𐌏',
    'C': '𐐄',
    'D': '𐐬',
    'E': '𐓪',
    'F': '𐓂'
};

const mooToHex: Record<HexadecimooChar,HexadecimalChar> = {
   'o' : '0',
   'O' : '1',
   'о' : '2',
   'О' : '3',
   'ᴏ' : '4',
   'ⲟ' : '5',
   'Ⲟ' : '6',
   'ꓳ' : '7',
   '𝚘' : '8',
   '𝙾' : '9',
   '𐊫' : 'A',
   '𐌏' : 'B',
   '𐐄' : 'C',
   '𐐬' : 'D',
   '𐓪' : 'E',
   '𐓂' : 'F'
};

 export const strToMoo = (str: string) : string => {
    const strArray = Array.from(str);
    const mooArray: string[] = [];
    strArray.forEach(c => {
        const charCode = c.charCodeAt(0);
        if (charCode >= 256) throw new Error('Sorry, can\'t encode characters beyond charCode 255');
        const hexCode = charCode.toString(16).toUpperCase();
        if (hexCode.length == 1) {
            mooArray.push(hexToMoo['0']);
            const h:HexadecimalChar = <HexadecimalChar>hexCode[0];
            mooArray.push(hexToMoo[h]);
            return;
        }
        const c1:HexadecimalChar = <HexadecimalChar>hexCode[0];
        mooArray.push(hexToMoo[c1]);
        const c2:HexadecimalChar = <HexadecimalChar>hexCode[1];
        mooArray.push(hexToMoo[c2]);
    });
    return mooArray.join('');
 }

 export const mooToStr = (str: string) : string => {
    const hexArray: string[] = [];
    const mooArray = Array.from(str);
    mooArray.forEach(m => {
        const mooChar: HexadecimooChar = <HexadecimooChar>m;
        hexArray.push(mooToHex[mooChar]);
    });
    let resultString = "";
    for(let i = 0;i < hexArray.length; i+= 2){
        const hexCode = hexArray[i] + hexArray[i+1];
        resultString += String.fromCharCode(parseInt(hexCode, 16));
    }
    return resultString;
 }