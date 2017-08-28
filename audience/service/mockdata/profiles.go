package mockdata

import (
	"math/rand"
	"time"
)

var lastNames = []string{"Walker", "Ramsey", "Goodwin", "Flowers", "Perry", "Williams", "Silva", "Barnes", "Fletcher", "Rivera", "Thompson", "Harper", "Sharp", "Welch", "Mack", "Yates", "Freeman", "Blair", "Morris", "Poole", "Curtis", "Hodges", "Garcia", "Fuller", "Sparks", "Torres", "Powers", "Moran", "Rodriquez", "Fitzgerald", "Hall", "Mason", "Gomez", "Owen", "Black", "Neal", "Mccormick", "Vargas", "Hayes", "Morrison", "Wheeler", "Wise", "Perkins", "Peters", "Ellis", "Sanchez", "Walsh", "Lawrence", "Reeves", "Simpson"}
var firstNames = []string{"Jan", "Jimmie", "Maggie", "Joel", "Evelyn", "Orville", "Emmett", "Hubert", "Terrence", "Andy", "Kenny", "Rose", "Lloyd", "Katherine", "Margarita", "Katie", "Lamar", "Jeff", "Doug", "George", "Angelo", "Louis", "Stella", "Jon", "Leonard", "Stacy", "Verna", "Joyce", "Clifford", "Rufus", "Dawn", "Sue", "Rickey", "Vickie", "Danny", "Blanche", "Eric", "Sheryl", "Naomi", "Kayla", "Jason", "Jeremiah", "Mark", "Everett", "Alex", "Omar", "Darla", "Marco", "Jennifer", "Brett"}

func RandomFirstName() string {
	rand.Seed(time.Now().Unix())
	return firstNames[rand.Intn(len(firstNames))]
}

func RandomLastName() string {
	rand.Seed(time.Now().Unix())
	return lastNames[rand.Intn(len(lastNames))]
}
