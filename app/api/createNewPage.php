<?php

$newfile = '../../' . $_POST['name'] . '.html';

if (file_exists($newfile)){ //проверка существует ли такой файл
    header('HTTP/1.0 400 Bad Request'); //возвращаем ошибку
} else {
    fopen($newfile, 'w'); //создаем новый файл для редактирования
}
