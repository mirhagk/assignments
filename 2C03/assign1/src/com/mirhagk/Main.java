

package com.mirhagk;

import java.util.*;

public class Main {

    public static void main(String[] args) {
        int[] nums1 = new int[]{1,25,33,400};
        int[] nums2 = new int[]{1,25,400};
        //PrintSameNums(nums1,nums2);

        //int[] nums = new int[]{-100,-14,-6,-3,1,2,3,4,5,6,16,17,100,102};
        int[] nums = new int[]{-5,-4,-3,1,2,3,4,5,7,9,10};
        //System.out.println(TwoSumFaster(nums));
        //System.out.println(ThreeSumFaster(nums));


        FarthestPair(new double[]{-1.0,-5.0,1.0,5,100,4,-4});
        return;

	// write your code here
        /*DoubleStack<Integer> test = new DoubleStack<Integer>();
        test.push1(1);
        test.push2(2);
        test.push1(3);
        System.out.print(test.pop1());
        System.out.print(test.pop2());
        //for(int i: test){
//            System.out.print(i);
//        }
        //StdOut.println("(");*/
    }
    public static int TwoSumFaster(int[] nums){
        int total = 0;
        int i = 0;
        int j = nums.length - 1;
        while(i!=j&&nums[i]<=0&&nums[j]>=0){
            if (nums[i]+nums[j]==0) {
                total++;
                System.out.println(nums[j]);
            }
            if (Math.abs(nums[i])>nums[j])
                i++;
            else
                j--;
        }
        return total;
    }
    public static int ThreeSumFaster(int[] nums){
        int total = 0;
        int i = 0;
        int j = 1;
        int k = nums.length - 1;
        while(i!=j&&nums[i]<=0&&nums[k]>=0){
            if (nums[i]+nums[j]+nums[k]==0){
                total++;
                //System.out.format("%d + %d == %d\n",nums[i],nums[j],nums[k], nums[i]+nums[j]);
            }
            if (Math.abs(nums[i]+nums[j])>nums[k]){
                j++;
                if (j==k){
                    i++;
                    j = i+1;
                    if (j==k)
                        break;
                }
            }
            else{
                k--;
            }
        }
        return total;
    }
    public static void FarthestPair(double[] nums){
        double minimum = Double.MAX_VALUE;
        double maximum = Double.MIN_VALUE;
        for(double value:nums){
            if (value<minimum)
                minimum = value;
            if (value>maximum)
                maximum = value;
        }
        System.out.format("%.3f, %.3f, distance = %.3f",minimum, maximum, maximum - minimum);
    }
    public static void PrintSameNums(int[] nums1, int[] nums2){
        int p1 = 0;
        int p2 = 0;
        while(p1<nums1.length&&p2<nums2.length){
            if (nums1[p1]==nums2[p2])
                System.out.println(nums1[p1]);
            if (nums1[p1]<nums2[p2])
                p1++;
            else
                p2++;
        }
    }
}
