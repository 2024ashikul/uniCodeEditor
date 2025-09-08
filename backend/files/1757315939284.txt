using System;
using System.Collections.Generic;

public class Vehicle
{
    public string Company { get; set; }
    public string Model { get; set; }
    public double DailyRentalRate { get; set; }

    public Vehicle(string company, string model, double dailyRentalRate)
    {
        Company = company;
        Model = model;
        DailyRentalRate = dailyRentalRate;
    }

    // Virtual method to override in derived classes
    public virtual double CalculateCost(int days)
    {
        return days * DailyRentalRate;
    }

    public virtual void DisplayInfo(int days)
    {
        Console.WriteLine($"{Company} {Model}, Rental Cost for {days} days: ${CalculateCost(days)}");
    }
}

public class Car : Vehicle
{
    public Car(string company, string model, double dailyRentalRate)
        : base(company, model, dailyRentalRate) { }

    public override double CalculateCost(int days)
    {
        double cost = base.CalculateCost(days);
        if (days > 7)
        {
            cost *= 0.9; // 10% discount
        }
        return cost;
    }
}

public class Bike : Vehicle
{
    public Bike(string company, string model, double dailyRentalRate)
        : base(company, model, dailyRentalRate) { }

    public override double CalculateCost(int days)
    {
        double cost = base.CalculateCost(days);
        if (days > 3)
        {
            cost *= 0.8; // 20% discount
        }
        return cost;
    }
}

public class Truck : Vehicle
{
    public double LoadCapacity { get; set; } // in tons

    public Truck(string company, string model, double dailyRentalRate, double loadCapacity)
        : base(company, model, dailyRentalRate)
    {
        LoadCapacity = loadCapacity;
    }

    public override double CalculateCost(int days)
    {
        double baseCost = base.CalculateCost(days);
        double loadCharge = LoadCapacity * 50; // $50 per ton
        return baseCost + loadCharge;
    }

    public override void DisplayInfo(int days)
    {
        Console.WriteLine($"{Company} {Model}, Load Capacity: {LoadCapacity} tons, Rental Cost for {days} days: ${CalculateCost(days)}");
    }
}

public class Program
{
    public static void Main()
    {
        List<Vehicle> vehicles = new List<Vehicle>
        {
            new Car("Toyota", "Camry", 70),
            new Bike("Yamaha", "R15", 30),
            new Truck("Volvo", "FH16", 150, 10)
        };

        int rentalDays = 8;

        foreach (var vehicle in vehicles)
        {
            vehicle.DisplayInfo(rentalDays);
        }
    }
}
