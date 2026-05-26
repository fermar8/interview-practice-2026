/*
Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, to get accepted, you need to do the following things:

Change the array nums such that the first k elements of nums contain the elements which are not equal to val. The remaining elements of nums are not important as well as the size of nums.
Return k.

Example 1:

Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).
Example 2:

Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).
*/

// Solution I came up with:
// Have a write index k that starts at 0. Iterate through the array with a read index. 
// If the current element is not equal to val, write it to the write index and increment the write index.
// We can replace the elements that are equal to val with the ones that are not and not miss any elements that are not equal to val.
// Finally, return the write index as the number of elements that are not equal to val.

function removeElement(nums: number[], val: number): number {
  let k = 0; // write index
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[k] = nums[read];
      k++;
    }
  }
  return k;
}

// This solution is 0(n) time complexity and 0(1) space complexity, since we are not using any extra space to store the modified array.
//  We are modifying the array in place.