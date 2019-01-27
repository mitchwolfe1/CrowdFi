<<<<<<< HEAD

import java.math.*;
import java.util.Scanner;

public class SignalTest {
	public static void main(String[] args) {
		Scanner s;
		double strength;
		double frequency;

		s = new Scanner(System.in);
		System.out.println("Enter signal strength (MHz): ");
		strength = s.nextDouble();
		frequency = 2400.0;
		System.out.println(getDistance(strength, frequency));

	}

	public static double getDistance(double signalStrengthMHz, double freq) {
		return Math.pow(10.0, (27.55 - (20 * Math.log10(freq)) + Math.abs(signalStrengthMHz)) / 20.0);
	}
=======
import java.math.*;
import java.util.Scanner;
public class SignalTest {
	public static void main(String[] args)
	{
		Scanner s;
    double strength;
    double frequency;

    s = new Scanner(System.in);
    System.out.println("Enter signal strength (MHz): ");
		strength = s.nextDouble();
		frequency = 2400;
    System.out.println(getDistance(strength, frequency));




  public double getDistance(double signalStrengthMHz, double frequency)
  {
    return Math.pow(10.0,(27.55 - (20 * Math.log10(frequency)) + Math.abs(strength)) / 20.0);
  }

>>>>>>> master
}
