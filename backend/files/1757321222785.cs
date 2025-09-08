using System;

abstract class Shape{
    public abstract double CalculateArea();
}

class Rectangle : Shape{
    public int height {get ; set;}
    public int width {get ; set;}
    public override double CalculateArea()
    {
        return height * width;
    }
}


class Circle : Shape{
    public int r {get ;set;}
     public override double CalculateArea()
    {
        return Math.PI * r * r;
    }
}

class Program{
    public static void Main(){
        Rectangle r = new Rectangle { height = 4, width = 4 };
        Console.WriteLine($"Rectangle Area: {r.CalculateArea()}");

        Circle c = new Circle { r = 3 };
        Console.WriteLine($"Circle Area: {c.CalculateArea():F2}");

    }
}