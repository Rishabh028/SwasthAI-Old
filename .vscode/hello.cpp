#include<bits/stdc++.h>
//#define int long long
using namespace std;


int solve(vector<int>& nums,vector<vector<int>>&dp,int ind,int prev,int n){
    if(ind==n) return 0;
    if(dp[ind][prev+1]!=-1) return dp[ind][prev+1];
    int len1=solve(nums,dp,ind+1,prev,n);
    int len2=0;
    if(prev==-1 || nums[ind]>nums[prev]){
        len2=1+solve(nums,dp,ind+1,ind,n);
    }
    return dp[ind][prev+1]=max(len1,len2);
}

int32_t main(){
    int n=10;
    vector<int>nums={2,3,1,2,0,8,9,1,3,7};
    vector<vector<int>>dp(11,vector<int>(11,-1));
    cout<<solve(nums,dp,0,-1,10)<<endl;
}