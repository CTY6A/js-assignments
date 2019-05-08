'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    var numAssocArray = Array(10);
    for (var i = 0; i < numAssocArray.length; i++) {
        numAssocArray[i] = Array(3);
    }
    var tpl1 = ' _     _  _     _  _  _  _  _ ';
    var tpl2 = '| |  | _| _||_||_ |_   ||_||_|';
    var tpl3 = '|_|  ||_  _|  | _||_|  ||_| _|';
    for (i = 0; i < numAssocArray.length; i++) {
        numAssocArray[i][0] = tpl1.substr(i * 3, 3);
        numAssocArray[i][1] = tpl2.substr(i * 3, 3);
        numAssocArray[i][2] = tpl3.substr(i * 3, 3);
    }

    var lines = bankAccount.split('\n');
    var result = 0;
    var index;
    for (i = 0; i < lines[0].length; i += 3) {
        for (let j = 0; j < numAssocArray.length; j++) 
            if ((lines[0].substr(i, 3) == numAssocArray[j][0]) &&
                (lines[1].substr(i, 3) == numAssocArray[j][1]) &&
                (lines[2].substr(i, 3) == numAssocArray[j][2])) 
                index = j;

        result = result * 10 + index;
    }
    return result;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    var words = text.split(' ');
    var line;
    while (words.length > 0) {
        line = words.shift();
        while ((words.length > 0) && (line.length + words[0].length < columns))
            line += ' ' + words.shift();

        yield line;
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function IsStraight(cards) {
    var values = Array();

    for (var card of cards) {
        switch (card['name']) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '10':
                values.push(Number.parseInt(card['name']));
                break;
            case 'J':
                values.push(11);
                break;
            case 'Q':
                values.push(12);
                break;
            case 'K':
                values.push(13);
                break;
        }
    }
    values = values.sort((a, b) => b - a);

    for (var i = 0; i < values.length - 1; i++)
        if (values[i] - values[i + 1] != 1)
            return false;

    if ((values.length == 4) && !((values[0] == 13) || (values[3] == 2)))
        return false;

    return true; 
}

function IsFlush(cards) {
    for (var i = 1; i < cards.length; i++)
        if (cards[0]['suit'] != cards[i]['suit'])
            return false;

    return true;
}

function IsStraightFlush(cards) {
    return IsStraight(cards) && IsFlush(cards);
}

function IsFullHouse(cards) {
    var counter = 0;
    var remainingCards;
    for (var i = 0; (i < 3) && (counter != 3); i++) {
        counter = 1;
        for (var j = i + 1; j < cards.length; j++)
            if (cards[i]['name'] == cards[j]['name'])
                counter++;
        
        if (counter == 3)
            remainingCards = cards.filter(card => card['name'] != cards[i]['name']);
        else if (counter > 3)
            return false;
    }
    if ((counter == 3) && (remainingCards[0]['name'] == remainingCards[1]['name'])) {
        return true;
    }
    return false;
}

function ParseCard(card) {
    var matched = card.match(/([JQKA\d]+)(.)/);
    var result = new Array();
    result['name'] = matched[1];
    result['suit'] = matched[2];
    return result;
}

function GetMaxOfKind(cards) {
    var oneOfKindArray = new Array();
    var maxOfKind = 0;
    for (var card of cards) {
        if (oneOfKindArray[card['name']] === undefined) {
            oneOfKindArray[card['name']] = 1;
        } else {
            oneOfKindArray[card['name']]++;
        }
        maxOfKind = Math.max(maxOfKind, oneOfKindArray[card['name']]);
    }
    return maxOfKind;
}

function GetPairsCount(cards) {
    var nameCountArray = Array();
    var numOfPairs = 0;
    for (var card of cards) {
        if (nameCountArray[card['name']] === undefined)
            nameCountArray[card['name']] = 1;
        else if (++nameCountArray[card['name']] == 2)
                numOfPairs++;
    }
    return numOfPairs;
}

function getPokerHandRank(hand) {
    var cards = new Array(hand.length);
    for (let i = 0; i < hand.length; i++) {
        cards[i] = ParseCard(hand[i]);
    }

    if (IsStraightFlush(cards)) {
        return PokerRank.StraightFlush;
    }
    else if (GetMaxOfKind(cards) == 4) {
        return PokerRank.FourOfKind;
    }
    else if (IsFullHouse(cards)) {
        return PokerRank.FullHouse;
    }
    else if (IsFlush(cards)) {
        return PokerRank.Flush;
    }
    else if (IsStraight(cards)) {
        return PokerRank.Straight;
    }
    else if (GetMaxOfKind(cards) == 3) {
        return PokerRank.ThreeOfKind;
    }
    else if (GetPairsCount(cards) == 2) {
        return PokerRank.TwoPairs;
    }
    else if (GetPairsCount(cards) == 1) {
        return PokerRank.OnePair;
    }
    else
        return PokerRank.HighCard; 
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */

function GetRectangle(figure, row, column) {
    for (var i = row + 1; i < figure.length; i++) 
        if (figure[i][column] == '+') 
            for (var j = column + 1; j < figure[row].length; j++) {
                if (figure[i][j] == "+") {
                    if (figure[row][j] == "+") {
                        var f1 = true;
                        for (var k = row + 1; (k < i) && f1; k++) 
                            if (figure[k][j] != '|')
                                f1 = false;

                        if (f1) 
                            return [i - row + 1, j - column + 1];                        
                    }
                } else if (figure[i][j] != '-') 
                    break;
            }
        else if (figure[i][column] != '|') 
            break;

    return null;
}

function DrawRectangle(width, height) {
    return '+' + '-'.repeat(width - 2) + '+\n'
        + ('|' + ' '.repeat(width - 2) + '|\n').repeat(height - 2)
        + '+' + '-'.repeat(width - 2) + '+\n';
}

function* getFigureRectangles(figure) {
    var figureArr = figure.split('\n');
    
    for (var i = 0; i < figureArr.length; i++)
        for (var j = 0; j < figureArr[i].length; j++)
            if (figureArr[i][j] == '+') {
                var rectangle = GetRectangle(figureArr, i, j);
                if (rectangle != null)
                    yield DrawRectangle(rectangle[1], rectangle[0]);
               
            }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
