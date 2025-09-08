class BankAccount{
     public string AccountHolderName {get ; set;}
        int Balance {get; set;}
        
        public void WithDraw(int amount){
            this.Balance -= amount;
            Console.WriteLine($"Current Balance is {this.Balance}");
        }

        public void Deposit(int amount){
            this.Balance += amount;
            Console.WriteLine($"Current Balance is {this.Balance}");
        }
        public void DisplayInfo(){
            Console.WriteLine(this.Balance + " of the account is " +this.AccountHolderName);
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