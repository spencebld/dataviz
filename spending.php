<?php

error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);

//echo "Hello World!";
//echo $_GET["store"];

$servername = "localhost";
$username = "spencebld";
$password = "password";
$dbname = "spending";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
//echo "Connected successfully";

$sql = "SELECT * FROM `transactions_temp_2` ORDER BY `category` ASC, 'amount' DESC ";
//echo $sql . "\n";

$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    echo "week, date, time, location, amount, category";
    while($row = mysqli_fetch_assoc($result)) {
        echo $row["week"] .",". $row["date"] .",". $row["time"] .",". $row["location"] .",". $row["amount"] . "," . $row["category"] . "," . $row["participants"] . "\n";
    }
} else {
    echo "0 results";
}

mysqli_close($conn);

?>