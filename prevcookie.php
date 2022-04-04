<?php
    if(isset($_COOKIE['prevsunset'])){
        echo $_COOKIE['prevsunset'];
    }
    if(isset($_POST['prevsunset'])){
        setcookie('prevsunset',$_POST['prevsunset'],time()+(12*60*60));
    }else if(isset($_POST['if'])){
        echo 'turn back';
        if(!isset($_POST['prevsunset'])){
            echo 'sunset is not exist!';
        }
    }
?>