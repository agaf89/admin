<?php

$file = '../../dnjwk_12312_sad-43.html';

if (file_exists($file)){ //проверка существует ли такой файл
    unlink($file); //удаляем файл
} else {
    header('HTTP/1.0 400 Bad Request'); //возвращаем ошибку
}
