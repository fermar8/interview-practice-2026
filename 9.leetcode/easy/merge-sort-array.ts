// You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, 
// representing the number of elements in nums1 and nums2 respectively.
// Merge nums1 and nums2 into a single array sorted in non-decreasing order.
//The final sorted array should not be returned by the function, but instead be stored inside the array nums1. 
// To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, 
// and the last n elements are set to 0 and should be ignored. nums2 has a length of n.

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
  // Input: nums1 = [1], m = 1, nums2 = [], n = 0
  // Input: ((nums1 = [0]), (m = 0), (nums2 = [1]), (n = 1));

  // Solution I came up with:
  // Write nums2 on nums1 with a for look using n as index
  // Sort array nums1
  let counter = 0;
  for (let i = 0; i < nums2.length; i++) {
    nums1.splice(m + counter, 1, nums2[i]);
    counter++;
  }

  nums1.sort((a, b) => a - b);

  // Solution is 0(m+n) time complexity and 0(1) space complexity, 
  // since we are not using any extra space to store the merged array. 
  // We are merging the two arrays in place.

  // Most efficient solution:
  // We can use two pointers to merge the two arrays in place. 
  // We can start from the end of both arrays and compare the elements. 
  // We can place the larger element at the end of nums1 and move the pointer accordingly. 
  // We can repeat this process until we have merged all the elements from nums2 into nums1.
  // This is the solution:
    for (let i = m + n - 1; i >= 0; i--) {
        if (n === 0) {
        break;
        }
        if (m === 0) {
        nums1[i] = nums2[n - 1];
        n--;
        } else if (nums1[m - 1] > nums2[n - 1]) {
        nums1[i] = nums1[m - 1];
        m--;
        } else {
        nums1[i] = nums2[n - 1];
        n--;
        }
    };

    // This solution is also 0(m+n) time complexity and 0(1) space complexity, since we are not using any extra space to store the merged array.
    // However, this solution is more efficient than the previous solution, since we are not sorting the array after merging. 
    // We are merging the two arrays in place and maintaining the sorted order.

    // We prefer option 1 because of its simplicity and readability. It is easier to understand and implement.
    
}