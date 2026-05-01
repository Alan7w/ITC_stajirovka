// Task 1 - old35

// function old35(n){
//     return (n%3 == 0 && n%5 != 0) || (n%3 != 0 && n%5 == 0)
// }
// console.log(old35(15))


// Task 2 - less20

// function less20(n){
//     return (((n+1)%20) == 0) || (((n+2)%20) == 0)
// }
// console.log(less20(18))


// Task 3 - nearTen

// function nearTen(num){
//     return (num%10) <= 2 || ((num+2)%10) <=2
// }
// console.log(nearTen(19))


// Task 4 - teenSum

// function teenSum(a, b){
//     if (13<=a && a<=19 || 13<=b && b<=19) {
//         return 19
//     } else {
//         return a + b
//     }
// }
// console.log(teenSum(14, 9))


// Task 5 - answerCell

// function answerCell(isMorning, isMom, isAsleep){
//     if (isAsleep) {return false}
//     if (isMorning && isMom) {return true}
//     if (!isAsleep && !isMorning) {return true}
//     return false
// }
// console.log(answerCell(false, false, false))


// Task 6 - teaParty

// function teaParty(tea, candy){
//     if (tea<5 || candy<5) {return 0}
//     else if (tea>=(candy*2) || (tea*2)<=candy) {return 2}
//     else if (tea>=5 && candy>=5) {return 1}
// }
// console.log(teaParty(10, 20))


// Task 7 - fizzString

// function fizzString(str){
//     if (str.startsWith('f') && !str.endsWith('b')) {return 'Fizz'}
//     if (!str.startsWith('f') && str.endsWith('b')) {return 'Buzz'}
//     if (str.startsWith('f') && str.endsWith('b')) {return 'FizzBuzz'}
//     return str
// }
// console.log(fizzString('dib'))


// Task 8 - fizzString2

// function fizzString2(n){
//     if ((n%3) == 0 && (n%5) == 0) {return 'FizzBuzz!'}
//     if ((n%3) == 0) {return 'Fizz!'}
//     if ((n%5) == 0) {return 'Buzz!'}
//     return n.toString() + '!'
// }
// console.log(fizzString2(45))


// Task 9 - twoAsOne

// function twoAsOne(a, b, c){
//     return ((a+b) == c) || ((a+c) == b) || ((b+c) == a)
// }
// console.log(twoAsOne(1,2,3))


// Task 10 - inOrder

// function inOrder(a, b, c, bOk){
//     return bOk ? (c>b) : (a<b && b<c)
// }
// console.log(inOrder(1, 1, 2, true))