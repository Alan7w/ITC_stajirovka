// Task 1 - either24

// function either24(nums){
//     if (!nums.includes(4) && !nums.includes(2)) {return false}
//     var hasTwo2s = false
//     var hasTwo4s = false
//     for (let i=0; i<nums.length; i++) {
//         if (nums[i] == 2) {
//             if (i+1 < nums.length && nums[i+1] == 2) {
//                 hasTwo2s = true
//             }
//         } else if (nums[i] == 4) {
//             if (i+1 < nums.length && nums[i+1] == 4) {
//                 hasTwo4s = true
//             }
//         }
//     }
//     return (hasTwo2s && !hasTwo4s) || (!hasTwo2s && hasTwo4s)
// }
// console.log(either24([1, 2, 3, 2, 2, 4]))


// Task 2 - matchUp

// function matchUp(a, b){
//     let matchCounter = 0
//     for (let i=0; i<a.length; i++) {
//         let diff = Math.abs(a[i]-b[i])
//         // console.log(diff)
//         // if (diff <= 2 && diff > 0) {
//         //     matchCounter += 1
//         // }
//         matchCounter = (diff <= 2 && diff > 0) ? matchCounter + 1 : matchCounter
//     }
//     return matchCounter
// }
// console.log(matchUp([1, 2, 3], [2, 3, 5]))


// Task 3 - has77

// function has77(nums){
//     let indexesOf7 = []
//     nums.forEach((value, index) => {
//         if (value == 7) {
//             indexesOf7.push(index)
//         }
//     });
//     if (indexesOf7.length < 2) {return false}
//     for (let i=0; i<indexesOf7.length-1; i++){
//         let pair = indexesOf7.slice(i, i+2)
//         if (pair[1]-pair[0] <= 2) {return true}
//     }
//     return false
// }
// console.log(has77([7, 7, 1, 1, 7]))


// Task 4 - modThree

// function modThree(nums){
//     for (let i=0; i<nums.length; i++) {
//         if (nums[i] % 2 == 0) {
//             if (i+1 < nums.length && i+2 < nums.length) {
//                 if ((nums[i+1] % 2 == 0) && (nums[i+2] % 2 == 0)) {
//                     return true
//                 }
//             }
//         } else {
//             if (i+1 < nums.length && i+2 < nums.length) {
//                 if ((nums[i+1] % 2 != 0) && (nums[i+2] % 2 != 0)) {
//                     return true
//                 }
//             }
//         }
//     }
//     return false
// }
// console.log(modThree([9, 7, 2, 9, 2, 2, 6]))


// Task 5 - findTheMedian

// function findTheMedian(nums){
//     // nums.sort()
//     if (nums.length % 2 == 0) {
//         let lenDividedBy2 = Math.floor(nums.length/2)
//         return (nums[lenDividedBy2-1] + nums[lenDividedBy2]) / 2
//     } else {
//         return nums[Math.floor(nums.length/2)]
//     }
// }
// console.log(findTheMedian([11, 9, 0, 1]))


// Task 6 - tripleUp

// function tripleUp(nums){
//     for (let i=0; i<nums.length-2; i++) {
//         let firsAndSecond = nums[i+1] - nums[i]
//         let secondAndThird = nums[i+2] - nums[i+1]
//         if (firsAndSecond==1 && secondAndThird==1) {
//             return true
//         }
//     }
//     return false
// }
// console.log(tripleUp([10, 9, 8, -100, -99, 99, 100]))
