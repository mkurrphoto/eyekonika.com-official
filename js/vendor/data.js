/**
 * Data file for picture slider
 * Provides title data for the picture slider component
 */

// Function that returns title data as an array of rows (each row is an array of characters)
export function titles(index) {
    // Array of titles - each title is split into rows
    const titleData = [
        [['H', 'O', 'L', 'Y'], ['T', 'R', 'I', 'N']],  // Index 0 — Holy Trinity Monastery
        [['L', 'A', 'K', 'E'], ['W', 'O', 'O', 'D']],  // Index 1 — St. Alexander Nevsky (Lakewood)
        [['T', 'I', 'K', 'H'], ['O', 'N', 'S', ' ']],  // Index 2 — St. Tikhon's Monastery
        [['I', 'M', 'A', 'G'], ['E', 'S', ' ', ' ']],  // Index 3
        [['P', 'H', 'O', 'T'], ['O', 'S', ' ', ' ']],  // Index 4
        [['V', 'I', 'E', 'W'], ['S', ' ', ' ', ' ']],   // Index 5
        [['S', 'H', 'O', 'W'], [' ', ' ', ' ', ' ']],  // Index 6
        [['D', 'I', 'S', 'P'], ['L', 'A', 'Y', ' ']],  // Index 7
        [['C', 'O', 'L', 'L'], ['E', 'C', 'T', ' ']],  // Index 8
        [['A', 'R', 'T', ' '], [' ', ' ', ' ', ' ']],  // Index 9
        [['W', 'O', 'R', 'K'], ['S', ' ', ' ', ' ']],  // Index 10
        [['P', 'R', 'O', 'J'], ['E', 'C', 'T', ' ']],  // Index 11
        [['C', 'R', 'E', 'A'], ['T', 'I', 'V', 'E']],  // Index 12
        [['D', 'E', 'S', 'I'], ['G', 'N', ' ', ' ']],  // Index 13
        [['V', 'I', 'S', 'U'], ['A', 'L', ' ', ' ']],  // Index 14
        [['P', 'O', 'R', 'T'], ['F', 'O', 'L', 'I']],  // Index 15
        [['O', ' ', ' ', ' '], [' ', ' ', ' ', ' ']],  // Index 16
        [['S', 'T', 'U', 'D'], ['I', 'O', ' ', ' ']],  // Index 17
        [['G', 'A', 'L', 'L'], ['E', 'R', 'Y', ' ']],  // Index 18
        [['E', 'X', 'H', 'I'], ['B', 'I', 'T', ' ']],  // Index 19
        [['D', 'I', 'S', 'P'], ['L', 'A', 'Y', ' ']],  // Index 20
        [['S', 'E', 'R', 'I'], ['E', 'S', ' ', ' ']],  // Index 21
        [['C', 'O', 'L', 'L'], ['E', 'C', 'T', ' ']],  // Index 22
        [['A', 'R', 'C', 'H'], ['I', 'V', 'E', ' ']],  // Index 23
        [['M', 'E', 'M', 'O'], ['R', 'Y', ' ', ' ']],  // Index 24
        [['M', 'O', 'M', 'E'], ['N', 'T', ' ', ' ']],  // Index 25
        [['S', 'N', 'A', 'P'], ['S', 'H', 'O', 'T']],  // Index 26
        [['C', 'A', 'P', 'T'], ['U', 'R', 'E', ' ']],  // Index 27
        [['F', 'R', 'A', 'M'], ['E', ' ', ' ', ' ']],  // Index 28
        [['S', 'C', 'E', 'N'], ['E', ' ', ' ', ' ']],  // Index 29
    ];

    // Return the title at the given index, or default if index is out of range
    if (index >= 0 && index < titleData.length) {
        return titleData[index];
    }
    
    // Default title if index is out of range
    return [['P', 'I', 'C', 'T'], ['U', 'R', 'E', 'S']];
}

// Export title function as default for backward compatibility
export const title = titles;

