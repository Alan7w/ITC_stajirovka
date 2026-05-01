// Task 1 - noTeenSum

// function noTeenSum(a, b, c){
//     a = fixTeen(a)
//     b = fixTeen(b)
//     c = fixTeen(c)
//     return a+b+c
// }

// function fixTeen(n) {
//     if ((n>=13 && n<15) || (n>16 && n<=19)) {return 0}
//     return n
// }
// console.log(noTeenSum(1,2,13))


// Task 2 - roundSum

// function roundSum(a, b, c){
//     return round10(a) + round10(b) + round10(c)
// }

// function round10(num) {
//     let remainder = num % 10
//     if (remainder >= 5) {return num + (10-remainder)}
//     return num - remainder
// }
// console.log(roundSum(12, 13, 14))


// Task 3 - closeFar

// function closeFar(a, b, c){
//     let differenceAB = Math.abs(a-b)
//     let differenceAC = Math.abs(a-c)
//     if (differenceAB <= 1) {
//         if ((Math.abs(c-a) >= 2) && (Math.abs(c-b) >= 2)) {
//             return true
//         }
//     } else if (differenceAC <= 1) {
//         if ((Math.abs(b-a) >= 2) && (Math.abs(b-c) >= 2)) {
//             return true
//         }
//     }
//     return false
// }
// console.log(closeFar(1,2,3))