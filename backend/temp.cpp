
#include<vector>
#include<iostream>
#include<math.h>
using namespace std;
typedef long long ll;
#define debug cout << "debug" << endl;
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define nl cout << '\n';
#define srt(a) sort(a.begin(),a.end());
#define prt(a) for(ll x : a){cout << x <<" ";} cout << endl;
const int MOD = 1e9 + 7;


void solve(){
    ll n,c;
    cin >> n >> c;
    vector<ll>arr(n);
    for(int i = 0; i < n ; i++){
        cin >> arr[i];
    }
    
    
    ll to = 0;
    ll temp = 0;
    for(int i=1;temp < c;i++){
        to++;
        temp = pow(2,i);
    }
    cout <<  to << endl;
}

 
int main(){
    ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
    int t;
    cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
