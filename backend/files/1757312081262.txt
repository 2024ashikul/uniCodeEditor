public class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }
}

public class Dog : Animal
{
    public string Breed { get; set; }

    //Implement the Dog Constructor here.
    public Dog(string name,string breed) : base(name){
        Breed = breed;
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        Dog myDog = new Dog("Fido", "Golden Retriever"); //Example instantiation
        Console.WriteLine($"Animal Name: {myDog.Name}");
        Console.WriteLine($"Dog Breed: {myDog.Breed}");
    }
}