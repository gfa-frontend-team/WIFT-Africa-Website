/**
 * Maps country names to their ISO 2-letter codes.
 * This is used to generate flag URLs for countries where the API might return the full name or a non-standard code.
 */
export const COUNTRY_TO_CODE: Record<string, string> = {
    'Egypt': 'EG',
    'Ghana': 'GH',
    'Kenya': 'KE',
    'Morocco': 'MA',
    'Nigeria': 'NG',
    'Senegal': 'SN',
    'South Africa': 'ZA',
    'Tanzania': 'TZ',
    'Uganda': 'UG',
    'Zimbabwe': 'ZW',
    'Rwanda': 'RW',
    'Namibia': 'NA',
    'Zambia': 'ZM',
    'Cameroon': 'CM',
    'Botswana': 'BW',
    'Malawi': 'MW',
    'Mauritius': 'MU',
    'Mozambique': 'MZ',
    'Seychelles': 'SC',
    'Tunisia': 'TN',
    'Algeria': 'DZ',
    'Angola': 'AO',
    'Benin': 'BJ',
    'Burkina Faso': 'BF',
    'Burundi': 'BI',
    'Cabo Verde': 'CV',
    'Central African Republic': 'CF',
    'Chad': 'TD',
    'Comoros': 'KM',
    'Congo': 'CG',
    'Democratic Republic of the Congo': 'CD',
    'Djibouti': 'DJ',
    'Equatorial Guinea': 'GQ',
    'Eritrea': 'ER',
    'Eswatini': 'SZ',
    'Ethiopia': 'ET',
    'Gabon': 'GA',
    'Gambia': 'GM',
    'Guinea': 'GN',
    'Guinea-Bissau': 'GW',
    'Ivory Coast': 'CI',
    'Lesotho': 'LS',
    'Liberia': 'LR',
    'Libya': 'LY',
    'Madagascar': 'MG',
    'Mali': 'ML',
    'Mauritania': 'MR',
    'Niger': 'NE',
    'Sao Tome and Principe': 'ST',
    'Sierra Leone': 'SL',
    'Somalia': 'SO',
    'South Sudan': 'SS',
    'Sudan': 'SD',
    'Togo': 'TG',
}

/**
 * Generates a flag URL based on the country code or name.
 * 
 * @param code - The country code (e.g., 'GH', 'NG', 'HQ')
 * @param name - The full country name (e.g., 'Ghana', 'Nigeria') - optional fallback
 * @returns The URL string for the flag image or a special indicator code (e.g., 'AFRICA')
 */
export const getCountryFlagUrl = (code?: string, name?: string): string => {
    // Handle special cases
    if (code === 'HQ' || name === 'Global' || code === 'AFRICA') {
        return 'AFRICA'; // Special code to be handled by the UI to show a globe emoji
    }

    // If code is a valid 2-letter ISO code, use it
    if (code && code.length === 2 && code !== 'HQ') {
        return `https://flagsapi.com/${code}/flat/64.png`;
    }

    // If code is not available or invalid, try to map from the name
    if (name) {
        const mappedCode = COUNTRY_TO_CODE[name];
        if (mappedCode) {
            return `https://flagsapi.com/${mappedCode}/flat/64.png`;
        }
    }

    // If we still have a code that might be valid (but > 2 chars? unlikely for ISO, but maybe legacy data), try it as last resort if it looks like a code
    // Otherwise default to 'ZZ' (unknown)
    const finalCode = (code && code.length === 2) ? code : 'ZZ';

    return `https://flagsapi.com/${finalCode}/flat/64.png`;
}

/**
 * Helper to get just the ISO code (or mapped code)
 */
export const getCountryIsoCode = (code?: string, name?: string): string => {
    if (code === 'HQ' || name === 'Global') return 'AFRICA';

    if (code && code.length === 2 && code !== 'HQ') return code;

    if (name) {
        return COUNTRY_TO_CODE[name] || 'ZZ';
    }

    return 'ZZ';
}
