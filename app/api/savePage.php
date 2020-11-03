<?php
$_POST = json_decode( file_get_contents("php://input"), true );


$file = $_POST['pageName'] ;
$newHtml = $_POST['html'];

if (!is_dir('../backups/')){
    mkdir('../backups/');
}


$backups = json_decode(file_get_contents('../backups/backups.json'));//решаем проблеиу перезаписи. Зписываем исходные данные в переменную
if (!is_array($backups)){ //
    $backups = [];
}


if ($newHtml && $file){ //проверка существует ли такие данные с фронта
    $backupFN = uniqid() . '.html';
    copy('../../' . $file, '../backups/' . $backupFN );
    array_push($backups, ['page' => $file, 'file' => $backupFN, 'time' => date('H:i:s d:m:y') ]);//создаем массив с данными о файле
    file_put_contents('../backups/backups.json', json_encode($backups) );//запись нового бэкапа
   file_put_contents('../../' . $file, $newHtml); //запись нового файла
} else {
    header('HTTP/1.0 400 Bad Request'); //возвращаем ошибку}
}