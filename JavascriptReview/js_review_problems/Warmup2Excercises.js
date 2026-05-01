// Task 1 - last2

// function last2(str){
//     if (str.length < 2) {return 0}
//     let substr = str.slice(str.length-2)
//     let count = 0
//     for (let i=0; i<str.length-2; i++) {
//         if (str.substring(i, i+2) == substr) {
//         count++
//         }
//     }
//     return count
// }
// console.log(last2('hi'))


// Task 2 - arrayCount9

// function arrayCount9(nums){
//     let count = 0
//     nums.forEach(function(num){
//         if (num == 9) {
//         count++
//         }
//     })
//     return count
// }
// console.log(arrayCount9([1,9,9,3,9]))


// Task 3 - arrayFront9

// function arrayFront9(nums){
//   for (let i=0; i<nums.length; i++) {
//     if (nums[i] == 9 && i<4) {
//       return true
//     }
//   }
//   return false
// }
// console.log(arrayFront9([1,2,3,4,5]))


// Task 4 - array123

// function array123(nums){
//     for (let i=0; i<nums.length-2; i++) {
//         if (nums[i] == 1 && nums[i+1] == 2 && nums[i+2] == 3) {
//             return true
//         }
//     }
//     return false
// }
// console.log(array123([1,2,4,3]))


// Task 5 - stringMatch

// function stringMatch(a, b){
//     let stopPosition;
//     if ((a.length - b.length) < 0) {
//         stopPosition = a.length
//     } else {
//         stopPosition = b.length
//     }
//     let count = 0
//     for (let i=0; i<stopPosition-1; i++) {
//         if (a.charAt(i) == b.charAt(i) && 
//         a.charAt(i+1) == b.charAt(i+1)) {
//         count++
//         }
//     }
//     return count
// }
// console.log(stringMatch('xxcaazz', 'xxbaaz'))


// Task 6 - stringX

// function stringX(str){
//     if (str.length == 1 && str[0] == 'x') {
//         return 'xx'
//     }
//     let modifiedstr = ''
//     for (let i=0; i<str.length; i++) {
//         if (str[i] != 'x') {
//             modifiedstr += str[i]
//         }
//         if (str[i] == 'x') {
//             if ((i == 0) || (i == str.length-1)) {
//                modifiedstr += str[i]
//             }
//         }
//     }
//     return modifiedstr
// }
// console.log(stringX('x'))