<?phpsession_start();session_destroy();?><!DOCTYPE html><html><head>    <link rel="shortcut icon" type="image/x-icon" href="../img/icon/logo.ico"/>    <title>        Life of Cards    </title>    <!--Ter todos os simbolos -->    <meta charset="utf-8">    <!--Zoom em tablets/mobile-->    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">    <!--Boostrap 4.0 CDN -->    <meta http-equiv="X-UA-Compatible" content="IE=edge">    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"          integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">    <!--CSS do projeto -->    <link rel="stylesheet" type="text/css" href="../css/style.css"></head><body class="full"><div class="container">    <div class="text-center mt-2">        <img width="10%" src="../img/logo/logo.svg">    </div>    <div class="jumbotron" style="background-color:#c9c9c9">        <div class="container">            <!-- Radio Button: entrar/registrar -->            <div class="col-md-12 text-center">                <div class="btn-group btn-group-lg btn-group-justified" data-toggle="buttons">                    <label class="btn btn-primary active" id="opt-log">                        <input type="radio" name="options" id="option1" autocomplete="off" checked> Entrar                    </label>                    <label class="btn btn-primary" id="opt-reg">                        <input type="radio" name="options" id="option2" autocomplete="off"> Registrar                    </label>                </div>            </div>            <!-- Formulario para registro -->            <form role="form" action="php/registrar.php" method="post" style="display:none;" id="form-reg">                <div class="form-group">                    <input type="email" class="form-control form-email" id="reg-email"                           aria-describedby="emailHelp" placeholder="E-mail" name="email" required>                    <p style="display: none;color:green" id="email-val">Email Valido</p>                    <p style="display: none;color:red" id="email-inval">Email Invalido</p>                </div>                <div class="form-group">                    <input class="form-control" placeholder="Usuário" name="usuario" required></div>                <div class="form-group">                    <input type="password" class="form-control" placeholder="Senha" name="senha" required></div>                <div class="row">                    <div class="col-sm-12" style="text-align: center;">                        <button type="submit" class="btn btn-danger btn-lg" id="bot-reg" value="Submit" name="submit">                            Registrar                        </button>                    </div>                </div>            </form>            <!-- Formulario para entrar -->            <form role="form" action="php/entrar.php" method="post" id="form-log">                <div class="form-group">                    <input class="form-control" placeholder="Usuário" name="usuario" required>                </div>                <div class="form-group">                    <input type="password" class="form-control" placeholder="Senha" name="senha" required>                </div>                <div class="row">                    <div class="col-sm-12" style="text-align: center">                        <button type="submit" name="submit" class="btn btn-danger btn-lg" id="bot-log">Entrar</button>                    </div>                </div>            </form>            <!--Botão esqueceu a senha -->            <div class="row">                <div class="col-sm-12" style="text-align: center">                    <button type="button" class="btn btn-link" id="bot-esq">Esqueceu a senha?</button>                </div>            </div>            <!--Formulário Esqueceu a Senha -->            <form role="form" action="php/esqueceu.php" method="post" style="display:none;" id="form-esq">                <div class="form-group">                    <p style="text-align: center"> Digite o seu email para resetar a sua senha </p>                    <input type="email" class="form-control form-email" id="exampleInputEmail1"                           aria-describedby="emailHelp" placeholder="E-mail" name="email" required>                </div>                <div class="row">                    <div class="col-sm-12" style="text-align: center; margin-top: -2em;">                        <button type="submit" class="btn btn-warning btn-lg" id="bot-mudar" value="Submit"                                name="submit">Mudar Senha                        </button>                    </div>                </div>            </form>        </div>    </div></div><!--JQuery, Javascript para Bootstrap --><script        src="https://code.jquery.com/jquery-3.2.1.min.js"        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="        crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"        integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb"        crossorigin="anonymous"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js"        integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"        crossorigin="anonymous"></script><script src="../js/login.js"></script></body></html>