<?php
$_POST = json_decode( file_get_contents("php://input"), true );
$newfile = '../../temp.html';

if ($_POST['html']){ //проверка существует ли такой файл
   file_put_contents($newfile,$_POST['html'] ); //помещаем как контент в $newfile
} else {
    header('HTTP/1.0 400 Bad Request'); //возвращаем ошибку}
}