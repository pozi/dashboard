<?php
    // Credentials contain the API token
    include 'credentials.php';

    // Variables for HTML2PDF service request
    $path_json = "http://" . $_SERVER['SERVER_NAME'] . str_replace( basename($_SERVER['PHP_SELF']) , '', $_SERVER['REQUEST_URI'] ).'/../uploads/'.$_SERVER['filename'].'.json';
    $pvars   = array('url' => $path_json);
    $timeout = 30;

    // cURL configuration
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, 'https://htmlpdfapi.com/api/v1/pdf');
    curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Token ' . $api_token));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $pvars);
    $out = curl_exec($curl);
    curl_close ($curl);

    // Setting all headers
    header('Cache-Control: public'); 
    // We'll be outputting a PDF
    header('Content-type: application/pdf');
    // It will be called downloaded.pdf
    header('Content-Disposition: attachment; filename="'.$_SERVER['filename'].'.pdf"');
    // Content length
    header('Content-Length: '.strlen($out));

    // Response from the service: sent the PDF along!
    echo $out;
?>