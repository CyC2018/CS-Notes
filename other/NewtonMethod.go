package main

import (
	"fmt"
	"math"
)

const PRECISION = 0.000000001
const maxRunLoop = 100

func DichotomyEquation(a float64, b float64, f func(input float64) float64) (float64, int) {
	mid := (a + b) / 2.0
	count := 0
	for ; (b - a) > PRECISION; {
		if f(a)*f(mid) < 0.0 {
			b = mid
		} else {
			a = mid
		}
		mid = (a + b) / 2.0
		count++
	}

	return mid, count
}

func target(x float64) float64 {
	return (2.0*x*x + 3.2*x - 1.8)
}

func CalcDerivative(f func(input float64) float64, x float64) float64 {
	return (f(x+0.000005) - f(x-0.000005)) / 0.00001
}

func NewtonRaphson(f func(input float64) float64, x0 float64) (float64, int) {
	var x float64 = math.MaxInt64
	var count int = 0
	for count < maxRunLoop {
		x1 := x0 - f(x0)/CalcDerivative(f, x0)
		if (math.Abs(x1-x0) < PRECISION) {
			x = x1
			break
		}
		x0 = x1
		count++
	}
	return x, count
}

func main() {

	fmt.Println("Use DichotomyEquation method")
	mid, times := DichotomyEquation(-8.0, 8.0, target)
	fmt.Printf("values is %f, run %d times", mid, times)
	fmt.Println("Use Newton Raphson method")
	mid1, times1 := NewtonRaphson(target, -8.0)
	fmt.Printf("values is %f, run %d times", mid1, times1)
}
