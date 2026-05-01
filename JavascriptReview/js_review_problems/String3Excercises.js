// Task 1  - countTriple

// function countTriple(str){
//     if (str.length < 3) {return 0}
//     let countTriple = 0;
//     for (let i=0; i<str.length; i++) {
//         if ((i+1)<str.length && (i+2)<str.length) { 
//             if ((str[i] === str[i+2]) && (str[i] === str[i+1])) {
//                 countTriple++
//             }
//         }
//     }
//     return countTriple
// }
// console.log(countTriple('abcXXXabc'))


// Task 2 - sumDigits

// function sumDigits(str){
//     let sum = 0
//     for (let char of str) {
//         if (!isNaN(char)) {
//         sum += parseInt(char)
//         }
//     }
//     return sum
// }
// console.log(sumDigits('svjdn3dsvljn4'))


// Task 3 - sameEnds

// function sameEnds(nums, len){
//     let substring = nums.slice(0, len)
//     return nums.slice(nums.length-len) == substring
// }
// console.log(sameEnds('abXYab', 2))
// console.log(sameEnds('javajava', 4))


// Task 4 - mirrorEnds

// function mirrorEnds(string){
//     let mirrorImage = ''
//     for (let i=0; i<string.length; i++) {
//         if (string[i] == string[string.length-i-1]) {
//             mirrorImage += string[i]
//         } else {
//             return mirrorImage
//         }
//     }
//     return mirrorImage
// }
// console.log(mirrorEnds('aba'))