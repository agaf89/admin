<?php

$htmlfiles = glob('../../*.html');
$response = [];
foreach ($htmlfiles as $key) {
    array_push($response, basename($key));

}
echo json_encode($response);
