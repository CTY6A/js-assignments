'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!

    var result = new Array();
    var curSide, nextSide, midSide, abbreviation;
    for (var sideId = 0; sideId < sides.length; sideId++) {
        curSide = sides[sideId];
        nextSide = sides[(sideId + 1) % sides.length];
        midSide = (sideId % 2 == 0) ? curSide + nextSide : nextSide + curSide;
        for (var compassPoint = 0; compassPoint < 8; compassPoint++) {
            switch (compassPoint) {
                case 0:
                    abbreviation = curSide;
                    break;
                case 1:
                    abbreviation = curSide + 'b' + nextSide;
                    break;
                case 2:
                    abbreviation = curSide + midSide;
                    break;
                case 3:
                    abbreviation = midSide + 'b' + curSide;
                    break;
                case 4:
                    abbreviation = midSide;
                    break;
                case 5:
                    abbreviation = midSide + 'b' + nextSide;
                    break;
                case 6:
                    abbreviation = nextSide + midSide;
                    break;
                case 7:
                    abbreviation = nextSide + 'b' + curSide;
                    break;
                default:
                    break;
            }
            result.push({ abbreviation: abbreviation, azimuth: (sideId * 8 + compassPoint) * 11.25 });
        }
    }
    return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    var toExpand = [str];
    var appeared = new Array();

    while (toExpand.length > 0) {
        str = toExpand.pop();
        var matched = str.match(/{([^{}]*)}/);
        if (matched != null) 
            for (var viscera of matched[1].split(',')) 
                toExpand.push(str.replace(matched[0], viscera));
        else if (!appeared.includes(str)) {
                appeared.push(str);
                yield str;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    var result = new Array(n);
    for (var i = 0; i < n; i++) {
        result[i] = new Array(n);
    }

    var maxValue = Math.pow(n, 2);
    var i = 0, j = 0;
    for (var value = 0; value < maxValue; value++) {
        result[i][j] = value;
        if ((i + j) % 2 == 0) {
            if (j + 1 < n)
                j++;
            else
                i += 2;
            if (i > 0)
                i--;
        } else {
            if (i + 1 < n)
                i++;
            else
                j += 2;
            if (j > 0)
                j--;
        }
    }
    return result;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    var valuesCount = new Array(7).fill(0);
    var doubleExists = new Array(7).fill(false);
    for (var domino of dominoes) {
        for (var value of domino)
            valuesCount[value]++;

        if (domino[0] == domino[1])
            doubleExists[domino[0]] = true;
    }
    for (var i = 0; i < 7; i++)
        if ((valuesCount[i] == 2) && doubleExists[i])
            return false

    var oddCount = 0;
    for (var value of valuesCount)
        oddCount += value % 2;

    if ((oddCount == 0) || (oddCount == 2))
        return true;
    else
        return false;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    var curMin, curMax;
    var result = String();
    while (nums.length > 0) {
        curMin = nums.shift();
        curMax = curMin;
        while ((nums.length > 0) && (nums[0] - curMax == 1))
            curMax = nums.shift();

        switch (curMax - curMin) {
            case 0:
                result = result.concat(curMin.toString(), ',');
                break
            case 1:
                result = result.concat(curMin.toString(), ',', curMax.toString(), ',');
                break;
            default:
                result = result.concat(curMin.toString(), '-', curMax.toString(), ',');
                break;
        }
    }
    return result.slice(0, -1);
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
