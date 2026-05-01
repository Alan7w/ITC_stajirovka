// Task 1 - front3

// WITHOUT LOOP
// function front3(str){
//   if (str.length < 3) {
//     return str.repeat(3);
//   } else {
//     let theFront = str.substring(0, 3);
//     return theFront.repeat(3);
//   }
// }

// WITH LOOP
// function front3(str){
//   if (str.length < 3) {
//     return str.repeat(3);
//   } else {
//     let theFront = "";
//     for (let i=0; i<3; i++) {
//         theFront += str.charAt(i);
//     }
//     // console.log(theFront)
//     let repeatThree = ""
//     for (let i=0; i<3; i++) {
//         repeatThree += theFront;
//     }
//     return repeatThree;
//   }
// }
// console.log(front3("abcabckfjnd"))


// Task 2 - backAround

// WITHOUT LOOP
// function backAround(str) {
//     let lastChar = str.charAt(str.length-1)
//     return lastChar + str + lastChar
// }
// console.log(backAround('ab'))


// Task 3 - or35

// function or35 (n) {
//     return ((n % 3)==0) || ((n % 5)==0)
// }
// console.log(or35(8))


// Task 4 - front22

// WITHOUT LOOP
// function front22(str){
//   let last2Char = str.slice(0, 2)
//   return last2Char + str + last2Char
// }
// console.log(front22('kitten'))

// WITH LOOP
// function front22(str){
//   let last2Char = ""
//   let i = 0
//   while (i<2 && i<str.length) {
//     last2Char += str.charAt(i)
//     i++
//   }
//   return last2Char + str + last2Char
// }
// console.log(front22('kitten'))


// Task 5 - startHi

// WITHOUT LOOP
// function startHi(str) {return str.startsWith('hi')}
// console.log(startHi('hi there'))
// console.log(startHi('hello there'))

// WITH LOOP
// function startHi(str) {
//     let i = 0
//     let checkStr = ''
//     while (i<2 && i<str.length) {
//         checkStr += str.charAt(i)
//         i++
//     }
//     return checkStr == 'hi'
// }
// console.log(startHi('hi there'))


// Task 6 -  icyHot

// function icyHot(temp1, temp2){
//     return (temp1 < 0 && temp2 > 100) || (temp2 < 0 && temp1 > 100)
// }
// console.log(icyHot(120, -1))
// console.log(icyHot(120, 1))


// Task 7 - in1020

// function in1020(a, b){
//     return (10<=a && a<=20) || (10<=b && b<=20)
// }
// console.log(in1020(20, 9))


// Task 8 - hasTeen

// function hasTeen (a, b, c) {
//     return (13<=a && a<=19) || (13<=b && b<=19) || (13<=c && c<=19)
// }
// console.log(hasTeen(1, 20, 10))


// Task 9 - loneTeen

// function loneTeen(a, b) {
//     return ((13<=a && a<=19) && (13>b || b>19)) || 
//             ((13<=b && b<=19) && (13>a || a>19))
// }
// console.log(loneTeen(20, 19))


// Task 10 - delDel

// WITHOUT LOOP
// function delDel(str){
//     if (str.length < 4) {
//         return str
//     }
//     if (str.indexOf('del') == 1) {
//         let firstPart = str.slice(0, 1)
//         let secondPart = str.slice(4)
//         return firstPart + secondPart
//     } else {
//         return str
//     }
// }
// console.log(delDel('adelabc'))


// Task 11 - mixStart

// WITHOUT LOOP
// function mixStart(str){
//   return str.includes('ix')
// }
// console.log(mixStart('mix snacks'))

// WITH LOOP