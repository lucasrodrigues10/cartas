<?php

session_start();

include "db.php";


$usuario = $_POST['usuario'];

$senha = $_POST['senha'];

$email = $_POST['email'];


$situacaoE = ""; //erro de email

$situacaoU = ""; //erro de usuario igual

$situacao = ""; //erros gerais



/* Procura se já tem um usuário idêntico */

$query = "SELECT * FROM Usuario WHERE Login = '$usuario'";

$result = $conn->query($query);

$row = $result->fetch_assoc();

if ($result->num_rows > 0) {//se encontrar um usuario igual

    $situacaoU = "Usuario já Registrado";

    ?>

    <script> location.replace("../registroErro.php"); </script>

    <?php
}


/* Procura se já tem um email idêntico */

$query = "SELECT * FROM Usuario WHERE Email = '$email'";

$result = $conn->query($query);

$row = $result->fetch_assoc();

if ($result->num_rows > 0) { //se encontrar um email igual

    $situacaoE = "Email já Registrado";

    ?>

    <script> location.replace("../registroErro.php"); </script>

    <?php

}


if (($situacaoE === "") && ($situacaoU === "")) {//insere se nao tiver iguais

    $query = "INSERT INTO Usuario (Login,Senha,Email) VALUES ('$usuario','$senha','$email');";

    if ($conn->query($query)) {

        /* Email para informar o registro*/

        $subject = 'Life of Cards - Registrado com sucesso';

        $message =

            'Bem vindo, ' . $usuario . '!' . "\r\n" .

            'O seu registro foi realizado com sucesso. ' . "\r\n";

        $headers = 'From: lifeofcards@lifeofcards.site11.com' . "\r\n" .

            'Reply-To: webgame10@outlook.com' . "\r\n" .

            'X-Mailer: PHP/' . phpversion();

        $envio = mail($email, $subject, $message, $headers);

        if ($envio)

            $situacaoM = "sucesso";

        else

            $situacaoM = "erro";

        $query = "SELECT * FROM Usuario WHERE Login = '$usuario' AND Senha = '$senha'";

        $result = $conn->query($query);

        $row = $result->fetch_assoc();

        $_SESSION["id"] = $row["IDusuario"];

        $situacao = "Registrado com sucesso! ID: " . $row["IDusuario"] . " ";

        ?>

        <script> //location.replace("../main.php"); </script>

        <?php

    } else {

        $situacao = "Não foi registrado";
        ?>

        <script> location.replace("../registroErro.php"); </script>

        <?php
    }

}


$conn->close();

