<?php

if (file_exists($_FILES['image']['tmp_name']) && is_uploaded_file($_FILES['image']['tmp_name'])){
    $_FILES['image']['type'];
    $fileExt = explode('/', $_FILES['image']['type'])[1]; //разбиваем строку по / и берем расширение файла
    $fileName = uniqid() . '.' . $fileExt; //создаем уникальное имя файла и ставим расширение
    
    if (!is_dir('../../img/')){ //если нет папки, то создаем
        mkdir('../../img/');
    }
    
    move_uploaded_file($_FILES['image']['tmp_name'], '../../img/' . $fileName );
    echo json_encode(array('src' => $fileName ));
}