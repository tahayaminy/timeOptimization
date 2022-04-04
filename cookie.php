<?php
    if(isset($_COOKIE['api'])){
        echo $_COOKIE['api'];
    }
    if(isset($_POST['api'], $_POST['time'])){
        setcookie('api',$_POST['api'],time()+$_POST['time']);
    }else if(isset($_POST['if'])){
        echo 'turn back';
        if(isset($_POST['api'])){
            echo 'api is not exist!';
        }
        if(isset($_POST['time'])){
            echo 'time is not exist!';
        }
    }    
?>