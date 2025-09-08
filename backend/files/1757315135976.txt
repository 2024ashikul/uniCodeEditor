using System;
class BankAccount{
     public string AccountHolderName {get ; set;}
       public int Balance {get; set;}
        
        public void WithDraw(int amount){
            if(this.Balance<=0){
                Console.WriteLine("Not enough balance");
                return ;
            }
            this.Balance -= amount;
            Console.WriteLine($"Current Balance is {this.Balance}");
        }

        public void Deposit(int amount){
            this.Balance += amount;
            Console.WriteLine($"Current Balance is {this.Balance}");
        }
        public void DisplayInfo(){
            Console.WriteLine($"Balance is  {this.Balance}");
            Console.WriteLine($"Account Holder name is {this.Balance}");
        }
}

class Program{
    public static void Main(){
       BankAccount b = new BankAccount();
       b.AccountHolderName = "Ashikul";
       b.Balance = 10000;
       b.WithDraw(1000);
       b.Deposit(2000);
       b.DisplayInfo();
    }
}