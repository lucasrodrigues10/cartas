//carregador de assets
function loadAssets (){ 
    
    var arquivo = [];
    
    var contexto = this;
    
    game.load.image('tabuleiro','assets/tabuleiro.png');
    game.load.image('quadrado','assets/quadrado.png');
    game.load.image('quadInimigo','assets/quadInimigo.png');
    game.load.image('battle','assets/battle.png');
    game.load.image('fundo_verde','assets/fundo_verde.png');
    game.load.image('fundo_vermelho','assets/fundo_vermelho.png');
    game.load.image('relogio','assets/clock.png');
    //perguntando pro servidor quais são os arquivos que estão na pasta de spritesheets
    $.ajax({
        url: "getSprites.php",
        type: "post",
        context: contexto,
        dataType: "json",
        async:false,
        success: function(result){
            
            for(var key in result){
                tamanhoFrame = result[key];                
                nomeArquivo = key;
                nomeTextura = nomeArquivo.replace(".png",""); //nome da textura do phaser é nome do arquivo sem o '.png' no fim
                game.load.spritesheet(nomeTextura, 'assets/sprites/'+nomeArquivo, tamanhoFrame, tamanhoFrame);  
                listaSprites.push(nomeTextura);
        
            }
        }
            
    })
    
}



//cria os sprites de animações
function addAnimations(sprite){
    var key = sprite.key; //nome da textura utilizada
    var frameSpeed;      
  
    //  Define as animações dos sprites baseando-se no tamanha do arquivo do spritesheet. Imagens com 
    //  menos de 768 pixels possuem 12 frames de animação. Já imagens com mais de 1152 pixels possuem 36 frames.
    
    if (game.cache.getImage(key).width <= 768){
        
        frameSpeed = 3;
        
        walkUp = [4,8];     
        walkRight = [5,9];
        walkDown = [6,10];            
        walkLeft = [7,11];
                  
    } else if (game.cache.getImage(key).width >= 1152){
        
        frameSpeed = 6;
        
        walkUp = [4,8,12,16,20,24,28];
        walkRight = [5,9,13,17,21,25,29];
        walkDown = [6,10,14,18,22,26,30];
        walkLeft = [7,11,15,19,23,27,31];
          
    }

    sprite.animations.add('up',  walkUp, frameSpeed, true);
    sprite.animations.add('right',walkRight, frameSpeed, true);
    sprite.animations.add('down', walkDown,frameSpeed,true);
    sprite.animations.add('left',walkLeft, frameSpeed, true);
    
}

function deixaResponsivo(){
    //faz o canvas se ajustar ao tamanho da tela (responsivo)
    
    game.scale.scaleMode = Phaser.ScaleManager.aspectRatio;
	game.scale.pageAlignVertically = true;
	game.scale.pageAlignHorizontally = true;
	game.scale.setShowAll();
	game.scale.refresh();
}
var jogador = 1;
var turno = 1; 
var numLinhas = 7;
var numColunas = 11;
var margemLateral = 1;
var margemVertical = 2;

var listaSprites = [];
var jogo; //referencia para o sprite do tabuleiro
var spriteSelecionado;
var spriteMovimentado;
var listaSprites = [];
//criando um vetor 12x12 pra guardar as referencias dos sprites
var tabuleiro = new Array (12);
for (i=0;i<12;i++)
	tabuleiro[i] = new Array (12);


//função para criar sprites de maneira mais rápida
function summon (linhaTabuleiro,colTabuleiro,nome){ 
    var posX = linhaTabuleiro*32+31;
    var posY = colTabuleiro*32+32*margemVertical-1;
    var marcador;
	
	if (posicaoValida(posX,posY)){
        
        if (turno == jogador){
            marcador = game.add.sprite(posX,posY,'quadrado');
            marcadores.add(marcador);
        }
        else if (turno != jogador){
            marcador = game.add.sprite(posX,posY,'quadInimigo'); 
            marcadoresInimigo.add(marcador);
        }
    
        marcador.anchor.setTo(1,1);
        
        marcadores.setAll('alpha',0.5);
        marcadoresInimigo.setAll('alpha',0.5);
        
        var sprite = game.add.sprite(posX,posY,nome);
        //sprite.addChild(marcador);
        //adicionando informações da posição do sprite para facilatar posteriores funções
        sprite.linha = linhaTabuleiro;
        sprite.coluna = colTabuleiro;
        sprite.jogador = turno;
        marcador.sprite = sprite;
        atualizaPosicao(posX,posY,sprite);
        
        
        //criando resposta ao clique
        sprite.inputEnabled = true;
        sprite.hitArea = new Phaser.Rectangle(-32,-32,32,32);
        
        
        sprite.events.onInputDown.add(criaMovimentacao,this); 
       
        //habilitando fisica para movimentar os sprites
        game.physics.arcade.enable(sprite);

        //muda a âncora para o canto inferior direito
        sprite.anchor.set(1,1); 

        //cria animações para o sprite.
        addAnimations(sprite);  

        //adiciona o sprite ao grupo de unidades
        unidades.add(sprite);
        
        sprite.ataque = Math.floor((Math.random() * 10) + 1);
        sprite.defesa = Math.floor((Math.random() * 10) + 1);
        
        //insere na posicao do tabuleiro levando em conta a numeração do tabuleiro
        var defesa = game.make.text(sprite.x,sprite.y+15,sprite.ataque,{font:'11px Tahoma',fill: "#FF0000"});
        var ataque = game.make.text(sprite.x-15,sprite.y+15,sprite.defesa,{font:'11px Tahoma',fill:"#43d637"});
        
        defesa.fontWeight = 'bold';
        defesa.anchor.x = 1;
        defesa.anchor.y = 0.6;
        defesa.stroke = '#000000';
        defesa.strokeThickness = 2;
        
        ataque.fontWeight = 'bold';
        ataque.anchor.x = 1;
        ataque.anchor.y = 0.6;
        ataque.stroke = '#000000';
        ataque.strokeThickness = 2;
        
        textoAtk.add(defesa);
        textoDef.add(ataque);
        
        ataque.unidade = sprite;
        defesa.unidade = sprite;
       
        
    } else 
        console.log("posição inválida");
    
        
}


function move (sprite){

    limpaSprites();           //elimina quadrados antigos

    var frame;
    
    //desabilita o input pro usuario não fazer m*rda
    game.input.enabled = false;
    
    //remove a posicao anterior na matriz
    removePosicao(spriteSelecionado.x,spriteSelecionado.y);
	
    
    //move o objeto
    game.physics.arcade.moveToObject(spriteSelecionado,sprite,60,600);
    
    var dir = defineDirecao(spriteSelecionado);
    spriteSelecionado.animations.play(dir);
    
    switch (dir){
        case 'up':
            frame = 0;
            break;
        case 'right':
            frame = 1;
            break;
        case 'down':
            frame=2;
            break;
        case 'left':
            frame = 3;
            break;
    }
    
   
    //função para para o sprite quando ele chega ao destin
    game.time.events.add(600, function () {
        
        //corrige erro de precisão ao movimentar 
        spriteSelecionado.x = Math.ceil(sprite.x/32)*32-1;
        spriteSelecionado.y = Math.ceil(sprite.y/32)*32-1;
        
        
        spriteSelecionado.body.velocity.x = 0;
        spriteSelecionado.body.velocity.y = 0;
         
        //Ordena a ordem de rederização dos sprites
        unidades.sort('x');
        unidades.sort('y');
        
        
        game.input.enabled = true;
        
        //atualiza a posição do sprite movimentado na matriz.
        atualizaPosicao(spriteSelecionado.x,spriteSelecionado.y,null);
        spriteMovimentado = spriteSelecionado;
        spriteSelecionado.animations.stop();
        spriteSelecionado.frame = frame;
        spriteSelecionado = null;       //apaga referencia pro sprite clicado
    
    }, this);
	
    
	
    
}

function moveSec (sprite){
    
    
    move(sprite.anterior);
    
    game.time.events.onComplete.add(function(){
        spriteSelecionado = spriteMovimentado;
        game.time.events.removeAll();
        move(sprite);
        
    })
    
	
}


function criaMovimentacao (sprite){
   
    var podeMover = true;
    var cima,direita,baixo,esquerda;
    var quadrados = [];
    var quadSecundarios = [];
    var tipo_quadrado;
    spriteSelecionado = sprite;
    
     if (spriteSelecionado.jogador != jogador || jogador != turno){
         podeMover = false;
     } else
         podeMover = true;
    
  
    limpaSprites();
    
    posX = sprite.x;
    posY = sprite.y;
    
    mostraInfo(sprite);
    
    procuraInimigo(sprite);
    
    if (sprite.jogador == jogador)
        tipo_quadrado = 'quadrado'; //quadrado para movimentação de unidades aliadas 
    else if (sprite.jogador != jogador)
        tipo_quadrado = 'quadInimigo';
        
        
        
    /* go horse lindu*/
    try{
        cima = encontraUnidade(posX,posY-32).jogador == sprite.jogador;
    } catch(erro){ cima = true;}
        
    try{
        direita = encontraUnidade(posX+32,posY).jogador == sprite.jogador;
    } catch(erro){ direita = true;}
    
    try{
        baixo = encontraUnidade(posX,posY+32).jogador == sprite.jogador;
    } catch(erro){ baixo = true;}
        
    try{
        esquerda = encontraUnidade(posX-32,posY).jogador == sprite.jogador;
    } catch(erro){ esquerda = true;}
        
        
    //criando os quatro primeiros tiles de movimentação
    if (dentroDoMapa(posX,posY-32) && cima)
    quadrados.push(game.add.sprite(posX,posY-32,tipo_quadrado));   //cima
    if (dentroDoMapa(posX+32,posY) && direita)                    
    quadrados.push(game.add.sprite(posX+32,posY,tipo_quadrado));   //direita
    if (dentroDoMapa(posX,posY+32) && baixo)
    quadrados.push(game.add.sprite(posX,posY+32,tipo_quadrado));   //baixo
    if (dentroDoMapa(posX-32,posY) && esquerda)
    quadrados.push(game.add.sprite(posX-32,posY,tipo_quadrado));   //pra esquerda

    //adiciona os quadrados de movimento ao grupo
    movimentacao.addMultiple(quadrados);
    
    movimentacao.children.forEach(function(quadrado){
        quadrado.anchor.set(1,1);
        
        if(podeMover)
		quadrado.events.onInputDown.add(move,this);
        
        posX = quadrado.x;
        posY = quadrado.y;
		/* go horse lindu 2 */
        try{
            cima = encontraUnidade(posX,posY-32).jogador == sprite.jogador;
        } catch(erro){ cima = true;}

        try{
            direita = encontraUnidade(posX+32,posY).jogador == sprite.jogador;
        } catch(erro){ direita = true;}

        try{
            baixo = encontraUnidade(posX,posY+32).jogador == sprite.jogador;
        } catch(erro){ baixo = true;}

        try{
            esquerda = encontraUnidade(posX-32,posY).jogador == sprite.jogador;
        } catch(erro){ esquerda = true;}
        
        //cria os próximos tiles de movimentação
        if (dentroDoMapa(posX,posY-32)&&cima)
            quadSecundarios.push(game.add.sprite(posX,posY-32,tipo_quadrado));   //cima
        if (dentroDoMapa(posX+32,posY)&&direita)
            quadSecundarios.push(game.add.sprite(posX+32,posY,tipo_quadrado));   //direita
        if (dentroDoMapa(posX,posY+32)&&baixo)
            quadSecundarios.push(game.add.sprite(posX,posY+32,tipo_quadrado));   //baixo
        if (dentroDoMapa(posX-32,posY)&&esquerda)
            quadSecundarios.push(game.add.sprite(posX-32,posY,tipo_quadrado));   //pra esquerda
        
        //altera transparencia dos quadrados rincipais
        quadrado.alpha = 0.5;
            
			
		quadSecundarios.forEach(function(quadradoSecundario){
            if (quadradoSecundario.anterior == null)
			quadradoSecundario.anterior = quadrado; //cada quadrado secundario guarda um referencia do quadrado orirginal que o gerou
			quadradoSecundario.anchor.set(1,1);
			quadradoSecundario.inputEnabled = true;
            if(podeMover)
			quadradoSecundario.events.onInputDown.add(moveSec,this);
            //altera transparencia dos quadrados secundarios
			quadradoSecundario.alpha = 0.5;
		});
        
		movimentacao.addMultiple(quadSecundarios);
		
        quadrado.inputEnabled = true;
    });
    
    
    movimentacao.visible = true;
	
	
}

//função que atualiza a variavel global "tabuleiro"
function atualizaPosicao (posX,posY,sprite){
    var linha = (posX-31)/32-1;
    var coluna = (posY-63)/32-1;
    //corrigido
    
    //mande 'null' como paramentro para atualizar a posicao do sprite clicado
    if (sprite==null){
        if(tabuleiro[linha][coluna] == null) //evita que as cartas apaguem referencias de outros sprites
            tabuleiro[linha][coluna] = spriteSelecionado;
        return;
    }
    else 
        tabuleiro[linha][coluna] = sprite;      
    

}

function foraDoMapa (posX,posY){
    if ((posX < margemLateral*32) || (posX >= (margemLateral+numColunas)*32) ||
        (posY < margemVertical*32) || (posY >= (margemVertical+numLinhas)*32))
        return true;
    else 
        return false;
}

function dentroDoMapa (posX,posY){
    return !(foraDoMapa(posX,posY));
}

function removePosicao (posX,posY,sprite){
    var linha = (posX-31)/32-1;   
    var coluna = (posY-63)/32-1;
    if  (sprite == null)  {              //se sprite veio como nulo, significa que deve-se mexer no spriteSelecionado
        if (encontraUnidade(posX,posY)==spriteSelecionado)
            tabuleiro[linha][coluna] = null;
    } else {
        tabuleiro[linha][coluna] = null;
    }
}

function encontraUnidade (posX,posY){
	//transforma a coordenada em pixels para posição do tabuleiro 
    var linha = (posX-31)/32; 
	var coluna = (posY-63)/32;
	
	
	if (dentroDoMapa(posX,posY))                   //evita possiveis erros de indices
	   var casa = tabuleiro[linha-1][coluna-1];
   if (casa !=null) //casa ocupada por uma unidade
	   return casa;
	else
		return null; //casa livre (ou a posição fornecida está fora do mapa)
}

function posicaoValida(posX,posY){
    if (encontraUnidade(posX,posY)== null && dentroDoMapa(posX,posY))
      return true;
    else
      return false;     
} 


//encontra a direção em que o sprite está se movendo
function defineDirecao(sprite){
    if (sprite.body.velocity.x > 0.1)           //OBS: coloquei 0.1 porque com 0 dava errado
        sprite.direcao = "right";
    if (sprite.body.velocity.x < -0.1 )
        sprite.direcao =  "left";
    if (sprite.body.velocity.y < -0.1 )
        sprite.direcao = "up"; 
    if (sprite.body.velocity.y > 0.1 )
        sprite.direcao = "down";
    
    return sprite.direcao;
}


function mostraSprites(){
    
    //textos removidos parafacilitar visualizacao dos sprites
    
    
    coluna = 1;
    linha = 1;

    for (var i=0; i<listaSprites.length;i++){  
        summon(linha,coluna,listaSprites[i]);
        
        if (i%11==0 && i!=0){
            coluna +=2;
            linha = 1;
        }
        summon(linha,coluna,listaSprites[i]);      //tem summon duas vezes porque não sei programar   
        
        linha++;
       
                
        
    }
}



function atualizaTexto(){
    textoAtk.forEachAlive(function(texto){
        texto.x = texto.unidade.x;
        texto.y = texto.unidade.y;
        
    })
    textoDef.forEachAlive(function(texto){
        texto.x = texto.unidade.x-20;
        texto.y = texto.unidade.y;

    })
    
    
}

function desenhaInterface (){
    //barConfig1 = {x:150,y:30,comprimento:10, espessura:190,background:'#000000',color:'#fc9802'};
        
    vida1 = new HealthBar(this.game,
                         {x:0,y:0,width:192, height:32});
    vida1.setAnchor(0,0);
    vida1.setPercent(100);
    
    vida2 = new HealthBar(this.game,
                         {x:game.width,y:0,width:192,height:32,flipped:true});  
    vida2.setAnchor(1,0);
    vida2.setPercent(100);
    
    vida1.texto = game.make.text();
}

function mostraInfo(sprite){
    try{
        console.log ("-----------------------------")
        console.log("key: "+sprite.key);
        console.log("linha: "+sprite.linha);
        console.log("coluna: "+sprite.coluna);
        console.log("jogador: "+sprite.jogador);
        console.log("posição x : "+sprite.x);
        console.log("posição y : "+sprite.y);
        console.log("esta casa esta vazia?: "+ encontraUnidade(posX,posY))
        
    } catch (erro){
    console.log("erro: "+erro);
    }
    
}

function criaSummon(){
    
    movimentacao.removeAll("true"); // limpa o tabuleiro dos quadrados de movimentação
    unidades.children.forEach(function(unidade) {
        if (unidade.jogador == jogador){
            if (dentroDoMapa(unidade.x,unidade.y-32)) 
                grupoSummon.add(game.add.sprite(unidade.x,unidade.y-32,'quadrado'))
            if (dentroDoMapa(unidade.x+32,unidade.y-32)) 
                grupoSummon.add(game.add.sprite(unidade.x+32,unidade.y-32,'quadrado'))
            if (dentroDoMapa(unidade.x+32,unidade.y)) 
                grupoSummon.add(game.add.sprite(unidade.x+32,unidade.y,'quadrado'))
            if (dentroDoMapa(unidade.x+32,unidade.y+32)) 
                grupoSummon.add(game.add.sprite(unidade.x+32,unidade.y+32,'quadrado'))
            if (dentroDoMapa(unidade.x,unidade.y+32)) 
                grupoSummon.add(game.add.sprite(unidade.x,unidade.y+32,'quadrado'))
            if (dentroDoMapa(unidade.x-32,unidade.y+32)) 
                grupoSummon.add(game.add.sprite(unidade.x-32,unidade.y+32,'quadrado'))
            if ((unidade.x-32,unidade.y)) 
                grupoSummon.add(game.add.sprite(unidade.x-32,unidade.y,'quadrado'))
            if (dentroDoMapa(unidade.x-32,unidade.y-32)) 
                grupoSummon.add(game.add.sprite(unidade.x-32,unidade.y-32,'quadrado'))
        }                  
    })
    
    grupoSummon.children.forEach(function(tile){
        tile.anchor.setTo(1,1);
        tile.alpha = 0.3;
        //tile.events.onInputDown.add(,this)
    })
    
    
}

function encontraQuadrado(posX,posY){
    var quadEncontrados = grupoSummon.getAll('x',posX);
    
    for (var i=0;i<quadEncontrados.length;i++)
        if (quadEncontrados[i].y != posY)
            quadEncontrados.splice(i,1);
    
    if (quadEncontrados.length == 0)
        return null;
    else
        return quadEncontrados;
}

function procuraInimigo(sprite){
     var posX = sprite.x;
     var posY = sprite.y;
     
     var unidadesProximas = [];
     
     unidadesProximas.push (encontraUnidade(posX,posY-32));
     unidadesProximas.push (encontraUnidade(posX+32,posY-32));
     unidadesProximas.push (encontraUnidade(posX+32,posY));
     unidadesProximas.push (encontraUnidade(posX+32,posY+32));
     unidadesProximas.push (encontraUnidade(posX,posY+32));
     unidadesProximas.push (encontraUnidade(posX-32,posY+32));
     unidadesProximas.push (encontraUnidade(posX-32,posY));
     unidadesProximas.push (encontraUnidade(posX-32,posY-32));
     
     for (var i =0;i<unidadesProximas.length;i++){
         if (unidadesProximas[i] != null)
             if(unidadesProximas[i].jogador != sprite.jogador)
                 {   //encontrou inimigos
                     var lutar = game.add.sprite(-16,-16,'battle');
                     lutar.anchor.setTo(0.5,0.5);
                     lutar.scale.setTo(0.3);
                     grupoLuta.add(lutar);
                     unidadesProximas[i].addChild(grupoLuta);
                     //unidadesProximas[i].events.onInputDown.add(luta,this);
                     
                 }
     }
}

function criaRelogio(){
    duracao = 60
    count = duracao; //tempo em segundos
    minutos = 0;
    segundo = 0;
    
    posicaoH = game.width/2;
    
    fundo = game.add.sprite(posicaoH,0,'fundo_verde');    
    fundo.anchor.setTo(0.5,0);
    fundo.height = 44;
    
    
    relogio = game.add.sprite(posicaoH,2,'relogio');
    relogio.anchor.setTo(0.5,0);
    relogio.scale.setTo(0.01);
    
    contador = game.make.text(0,21,"0:00",{font:'10px Tahoma ',fill: "#000000"});
    contador.anchor.setTo(0.5,0);
    
    
    fundo.addChild(contador);
    
    
    setInterval(function(){
        count--;
        minutos = Math.floor(count/60);
        segundos = count - minutos *60;
        
        //melhor visualizaçao do tempo
        if (segundos >= 10)
            contador.text = minutos + ":" + segundos;
        else if (segundos < 10)
            contador.text = minutos + ":0" + segundos;
        
         if (segundos <=15)
            {
                fundo.loadTexture('fundo_vermelho');    
            }
        
        //troca de turno
        if (segundos == 0){
            trocaTurno();
        }
        
       
            
    },1000)
}

function esconderTexto(){
    textoAtk.visible=false;
    textoDef.visible=false;
}

function atualizaMarcadores(){
    marcadores.forEachAlive (function(marcador){
        marcador.x = marcador.sprite.x;
        marcador.y = marcador.sprite.y;
    })
    marcadoresInimigo.forEachAlive (function(marcador){
        marcador.x = marcador.sprite.x;
        marcador.y = marcador.sprite.y;
    })
    
    
}

function trocaTurno(){ 
    
    //limpa os quadrados para maior usabilidade do usuário
    movimentacao.removeAll(true);
    grupoSummon.removeAll(true);
    
    count = duracao; //reseta o relogio
    count = duracao; 
    fundo.loadTexture('fundo_verde');
    if (turno==1){ 
        console.log("começa turno do jogador 2");
        turno = 2;
        marcadoresInimigo.visible = true;
        marcadores.visible = false;
    }
    else if(turno==2){
        console.log("começa turno do jogador 1");
        turno = 1;
        marcadoresInimigo.visible = false;
        marcadores.visible = true;
    }
    
}

function limpaSprites(){
    movimentacao.removeAll(true);
    grupoSummon.removeAll(true);
    grupoLuta.removeAll(true);
}

function atualizaVida(){
    vida1.setPercent(jogador1.vida/25);
    vida2.setPercent(jogador2.vida/25);
    
}