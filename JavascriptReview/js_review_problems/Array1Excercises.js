// Task 1 - middleWay

// function middleWay(a, b){
//     // return [a[1], b[1]]
//     let elem1 = a[1]
//     let elem2 = b[1]
//     let newArr = []
//     newArr.push(elem1)
//     newArr.push(elem2)
//     return newArr
// }
// console.log(middleWay([1,2,3], [4,5,6]))


// Task 2 - makeEnds

// function makeEnds(nums){
// //   return [nums[0], nums[nums.length-1]]
//   let first = nums[0]
//   let last = nums[nums.length-1]
//   let newArray = []
//   newArray.push(first)
//   newArray.push(last)
//   return newArray
// }
// console.log(makeEnds([7, 4, 6, 2]))


// Task 3 - has23

// function has23(nums){
//     return nums.includes(2) || nums.includes(3)
// }
// console.log(has23([4,3]))


// Task 4 - no23

// function no23(nums){
//   return !(nums.includes(2) || nums.includes(3))
// }
// console.log(no23([4,3]))


// Task 5 - makeLast

// function makeLast(nums){
//     let numsCopy = []
//     for (let i=0; i<nums.length*2; i++) {
//         numsCopy.push(0)
//     }
//     numsCopy[numsCopy.length-1] = nums[nums.length-1]
//     return numsCopy
// }
// console.log(makeLast([1,2,3]))


// Task 6 - double23

// function double23(nums){
//     if (nums.length < 2) {return false}
//     if (nums.includes(2)) {return nums.every(num => num == 2)}
//     if (nums.includes(3)) {return nums.every(num => num == 3)}
//     return false
// }
// console.log(double23([3,3]))


// Task 7 - fix23

// function fix23(nums){
//     let indexOf2 = nums.indexOf(2)
//     for (i=indexOf2; i<nums.length; i++) {
//         if (nums[i] == 2) {
//             if ((i+1) < nums.length && nums[i+1] == 3){
//                 nums[i+1] = 0
//             }
//         }
//     }
//     return nums
// }
// console.log(fix23([1, 2, 3]))


// Task 8 - start1

// function start1(a, b){
//     let count = 0
//     if (a[0] == 1) {count++}
//     if (b[0] == 1) {count++}
//     return count
// }
// console.log(start1([1, 2, 3], [1, 3]))


// Task 9 - biggerTwo

// function biggerTwo(a, b){
//     if (a.reduce(sum) == b.reduce(sum)) {
//         return a
//     }
//     return result = a.reduce(sum) > b.reduce(sum) ? a : b
// }

// function sum(total, num) {
//     return total + num
// }
// console.log(biggerTwo([2, 2], [1, 3]))