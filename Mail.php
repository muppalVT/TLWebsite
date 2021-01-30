<?php
//Requires Classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\OAuth;
use League\OAuth2\Client\Provider\Google;
require 'src/PHPMailer.php';
require 'src/SMTP.php';
require 'src/OAuth.php';
require 'src/Exception.php';
require 'vendor/autoload.php';

//Import Data
// echo"php";
// echo '<pre>';
// print_r($_GET['jsDat']);
// echo '</pre>';
// $json=json_decode($_GET);

// $dataTab = $json->Data;
// $cus=$json->Name;
// $phone=$json->Phone;
// $time=$json->Time;

$dataTab=$_GET['Data'];
$cus=$_GET['Name'];
$phone=$_GET['Phone'];
$time=$_GET['Time'];
$time=date("g:i a", strtotime($time));


//Initialization
date_default_timezone_set( 'Etc/UTC' );

$mail = new PHPMailer();
$mail->isSMTP();
//Enable SMTP debugging
// SMTP::DEBUG_OFF = off ( for production use )
// SMTP::DEBUG_CLIENT = client messages
// SMTP::DEBUG_SERVER = client and server messages
$mail->SMTPDebug = SMTP::DEBUG_OFF;

//Host details
$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->SMTPAuth = true;
$mail->AuthType = 'XOAUTH2';

//Authentication details
$email = 'tonylukeslimerick@gmail.com';
$clientId = '531770256096-dr1b2k6p2q9pdq9g5mr87dfp43991kra.apps.googleusercontent.com';
$clientSecret = 'E7DbMQbanPDM6z05w8-p1eqg';
$refreshToken = '1//0d9uEAIGXPH7DCgYIARAAGA0SNwF-L9IrusOWgdlmrO2qsX90yP7cJNVbqUysHO6hHcdNm2YVq7uqCkvnkOyXgRdtHVbzK1tS9EM';
$provider = new Google(
    [
        'clientId' => $clientId,
        'clientSecret' => $clientSecret,
    ]
);
$mail->setOAuth(
    new OAuth(
        [
            'provider' => $provider,
            'clientId' => $clientId,
            'clientSecret' => $clientSecret,
            'refreshToken' => $refreshToken,
            'userName' => $email,
        ]
    )
);

//From and Recepient
$mail->setFrom( $email, 'TonyLukes Limerick' );
$mail->addAddress( 'tonylukeslimerick@gmail.com', 'Tony Lukes' );

//Set the contents
$mail->isHTML( true );
// Set email format to HTML
$mail->Subject = "Order for: $cus at $time";
$mail->CharSet = PHPMailer::CHARSET_UTF8;

$dataTabSt=preg_replace ( '/(?<=<)'.'table'.'?(?=>)/' , 'font size="4" face="arial"><table cellspacing="3" cellpadding="5" border="1"' , $dataTab);

$mail->Body = nl2br("For: $cus\nPick Up Time: $time \nCustomer Number: $Phone \n$dataTabSt");
if ( !$mail->send() ) {
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo '<font size="18";> Order Received! Your food will be ready at: ' .$time.  ' at Tony Lukes in the Philadelphia Premium Outlets. Call 6109703030 with any issues';
}

function conslog( $data ) {
    echo '<script>';
    echo 'console.log('. json_encode( $data ) .')';
    echo '</script>';
}
