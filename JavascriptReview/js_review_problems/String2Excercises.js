// Task 1 - xyBalance

// function xyBalance(str){
//     if (str == '') {return true}
//     if (!str.includes('x') && !str.includes('y')) {return true}
//     if (str.includes('x') && !str.includes('y')) {return false}
//     return str.lastIndexOf('x') < str.lastIndexOf('y')
// }
// console.log(xyBalance('bfcxnkds'))


// Task 2 - mixString

// function mixString(a, b){
//     let leftOver;
//     let difference = a.length - b.length
//     if (difference < 0) {
//         leftOver = b.slice(a.length)
//     } else if (difference > 0) {
//         leftOver = a.slice(b.length)
//     } else {
//         leftOver = ''
//     }
//     let mergedString = ''
//     let determinedLength = difference <= 0 ? a.length : b.length
//     for (let i=0; i<determinedLength; i++) {
//         mergedString += a[i] + b[i]
//     }
//     return mergedString + leftOver
// }

// console.log(mixString('Hi', 'There'))


// Task 3 - repeatEnd

// function repeatEnd(str, n){
//     return str.slice(str.length-n).repeat(n)
// }
// console.log(repeatEnd('hello', 4))


// Task 4 - repeatFront

// function repeatFront(str, n){
//     let modifiedString = ''
//     while (n>=0) {
//         modifiedString += str.slice(0, n)
//         n -= 1
//     }
//     return modifiedString
// }
// console.log(repeatFront('Chocolate', 4))


// Task 5 - repeatSeparator

// function repeatSeparator(word, sep, count){
//     let bigString = word
//     if (count == 0) {return ''}
//     for (let i=0; i<count-1; i++) {
//         bigString += sep + word
//     }
//     return bigString
// }
// console.log(repeatSeparator('Word', 'X', 3))


// Task 6 - prefixAgain

// function prefixAgain(str, n){
//     return str.slice(n).includes(str.slice(0, n))
// }
// console.log(prefixAgain('abXYabc', 1))


// Task 7 - xyzMiddle

// function xyzMiddle(str) {
//     for (let i=0; i<str.length; i++) {
//         if (str[i] == 'x') {
//             if (((i+1)<str.length && str[i+1] == 'y') && ((i+2)<str.length && str[i+2] == 'z')) {
//                 if (Math.abs((i)-(str.length-(i+3))) <= 1) {
//                     return true
//                 } else {
//                     continue;
//                 }
//             }
//         }
//     }
//     return false
// }
// console.log(xyzMiddle('xyzxyzAxyzxyzxy'))