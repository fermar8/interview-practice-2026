/*
Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.

Consider the number of elements in nums which are not equal to val be k, to get accepted, you need to do the following things:

Change the array nums such that the first k elements of nums contain the elements which are not equal to val. The remaining elements of nums are not important as well as the size of nums.
Return k.

Input: nums = [3,2,2,3], val = 3

Output: k = 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).

*/

class Solution {
  /**
   * @param {number[]} nums
   * @param {number} val
   * @return {number}
   */
  removeElement(nums: number[], val: number): number {
    /*
        Input: nums = [3,2,2,3], val = 3
        Output: k = 2, nums = [2,2,_,_]
        */
    let i = 0,
      n = nums.length;
    while (i < n) {
      if (nums[i] == val) {
        nums[i] = nums[--n];
      } else {
        i++;
      }
    }
    return n;
  }
}

// Time complexity 0(n) => One iteration through the original array
// Space complexity 0(1) => two variables always + the initial array in memory
