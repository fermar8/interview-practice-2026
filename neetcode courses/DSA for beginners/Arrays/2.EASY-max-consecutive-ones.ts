/*
Max Consecutive Ones
Easy
Topics
Company Tags
You are given a binary array nums, return the maximum number of consecutive 1's in the array.

Example 1:

Input: nums = [1,1,0,1,1,1]

Output: 3

Example 2:

Input: nums = [1,0,1,1,0,1]

Output: 2
Constraints:

1 <= nums.length <= 100,000
nums[i] is either 0 or 1.
*/

class MySolution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    findMaxConsecutiveOnes(nums: number[]): number {
    // Input: nums = [1,1,0,1,1,1]
    // Output: 3
    let currentCount = 0;
    let maxCount = 0

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 1 && nums[i - 1] !== 1) {
            currentCount = 1
        } else if (nums[i] === 1 && nums[i - 1] === 1){
          currentCount++; 
        }
    if (currentCount > maxCount) maxCount = currentCount;
        
    }

    return maxCount;

    }
}

// Time complexity 0(n) => One iteration through the original array
// Space complexity 0(1) => two variables always + the initial array in memory