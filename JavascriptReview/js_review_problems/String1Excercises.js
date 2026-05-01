// Task 1 - right2

// function right2(str){
//     return str.slice(-2) + str.slice(0, -2)
// }
// console.log(right2('hello'))


// Task 2 - theEnd

// function theEnd(str, front){
//     let result = front ? str[0] : str[str.length-1]
//     return result
// }
// console.log(theEnd('hello', true))


// Task 3 - withoutEnd2

// function withoutEnd2(str){
//     if (str.length < 3) {return ''}
//     // return str.slice(1, -1)
//     let modifiedstr = ''
//     for (let i=1; i<str.length-1; i++) {
//         modifiedstr += str[i]
//     }
//     return modifiedstr
// }
// console.log(withoutEnd2('abc'))


// Task 4 - middleTwo

// function middleTwo(str){
//     let midpoint = str.length / 2
//     return str.slice(midpoint-1, midpoint+1)
// }
// console.log(middleTwo('string'))


// Task 5 - endsLy

// function endsLy(str){
// //   return str.endsWith('ly')
//   return str.at(-2) == 'l' && str.at(-1) == 'y'
// }
// console.log(endsLy('oddly'))


// Task 6 - nTwice

// function nTwice(str, n){
//     return str.slice(0, n) + str.slice(str.length-n, str.length)
// }
// console.log(nTwice('hello', 2))


// Task 7 - twoChar

// function twoChar(str, index){
//     if ((str.length - index) < 2 || index < 0) {
//         return str[0] + str[1]
//     }
//     return str[index] + str[index+1]
// }
// console.log(twoChar('java', 0))


// Task 8 - middleThree

// function middleThree(str){
//     let midPoint = Math.floor(str.length / 2)
//     return str[midPoint-1] + str[midPoint] + str[midPoint+1]
// }
// console.log(middleThree('candy'))


// Task 9 - hasBad

// function hasBad(str){
//     return str.indexOf('bad') == 0 || str.indexOf('bad') == 1
// }
// console.log(hasBad('xxbadxxx'))


// Task 10 - atFirst

// function atFirst(str){
//     if (str == '') {return '@@'}
//     let newstr = str.length < 2 ? str+'@' : str[0]+str[1]
//     return newstr
// }
// console.log(atFirst('h'))


// Task 11 - lastChars

// function lastChars(a, b){
//     if (a == '' && b != '') {
//         return '@' + b.at(-1)
//     }
//     if (a != '' && b == '') {
//         return a[0] + '@'
//     }
//     if (a == '' && b == '') {
//         return '@'.repeat(2)
//     }
    
//     return a[0] + b.at(-1)
// }
// console.log(lastChars('',''))


// Task 12 - 

