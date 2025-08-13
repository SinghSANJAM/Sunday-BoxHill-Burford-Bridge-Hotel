<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data safely
    $name     = htmlspecialchars($_POST["name"]);
    $email    = htmlspecialchars($_POST["email"]);
    $mobile   = htmlspecialchars($_POST["mobile"]);
    $event    = htmlspecialchars($_POST["event"]);
    $guests   = htmlspecialchars($_POST["guests"]);
    $date     = htmlspecialchars($_POST["date"]);
    $comment  = htmlspecialchars($_POST["comment"]);
    $marketing = isset($_POST["marketing"]) ? "Yes" : "No";

    // Compose the email
    $to = "sales.waltonhall@hotelssunday.com";  // Replace with your actual email
    $subject = "New Enquiry from $name - Sunday Warwickshire Website";
    $message = "
        Full Name: $name\n
        Email: $email\n
        Mobile: $mobile\n
        Nature of Event: $event\n
        Number of Guests: $guests\n
        Preferred Date: $date\n
        Comment: $comment\n
        Marketing Permission: $marketing
    ";
    $headers = "From: no-reply@sundaywarwickshire.com";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "<p>Thank you! Your enquiry has been sent successfully.</p>";
    } else {
        echo "<p>Sorry, something went wrong. Please try again.</p>";
    }
} else {
    echo "<p>Invalid request.</p>";
}
?>
