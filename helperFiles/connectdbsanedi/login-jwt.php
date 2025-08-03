<?php
include_once("headers.php");
include_once("db_connect_test.php");
    $postdata = file_get_contents("php://input");
    require 'vendor/autoload.php'; // Include the JWT library
    $postdata = file_get_contents("php://input");

    use Firebase\JWT\JWT;
    
    if(isset($postdata) && !empty($postdata))
    {
        $request = json_decode($postdata);
        $lu_password = mysqli_real_escape_string($mysqli, trim($request->lu_password));
        $lu_email = mysqli_real_escape_string($mysqli, trim($request->lu_email));

        $sql = "SELECT * FROM login_user WHERE lu_email='$lu_email' AND lu_password='$lu_password'";

        $result = mysqli_query($mysqli,$sql);
        $nums = mysqli_num_rows($result);

        if($nums>0){
            $row = mysqli_fetch_assoc($result);
            $secret_key = "1234567234";
            $issuer_claim = "dithetoGroup";
            $audience_claim = "portal";
            $issuedat_claim = time();
            $notbefore_claim = $issuedat_claim + 10; // Token is not valid before 10 seconds
            $expire_claim = $issuedat_claim + 3600; // Token will expire in 1 hour
            $token = array(
                "iss" => $issuer_claim,
                "aud" => $audience_claim,
                "iat" => $issuedat_claim,
                "nbf" => $notbefore_claim,
                "exp" => $expire_claim,
                "data" => array(
                    "lu_user_id" => $row['lu_user_id'],
                    "lu_email" => $row['lu_email']
                )
            );

            http_response_code(200);
            $jwt = JWT::encode($token, $secret_key, 'HS256');
            echo json_encode(
                array(
                    "message" => "Successful login.",
                    "jwt" => $jwt
                )
            );

        } else {
            $data=array('message' => 'failure');
            echo json_encode($data);
        }

    }
?>