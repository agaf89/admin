<?php
$_POST = json_decode( file_get_contents("php://input"), true );
echo $_POST;
$file = '../../' . $_POST['name'];

if (file_exists($file)){ //проверка существует ли такой файл
    unlink($file); //удаляем файл
} else {
    header('HTTP/1.0 400 Bad Request'); //возвращаем ошибку
}
