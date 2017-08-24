//carregador de assets
function loadAssets (){ 
    
    game.load.image('tabuleiro','assets/tabuleiro.png');
    game.load.image('quadrado','assets/quadrado.png');
	game.load.spritesheet('devil','assets/devil.png',32,32);
	game.load.spritesheet('mummy','assets/mumia.png',32,32);
    game.load.spritesheet('torturer','assets/torturer.png',64,64); //imagem grande
    game.load.spritesheet('banshee','assets/banshee.png',64,64); //imagem grande
    game.load.spritesheet('ferumbras','assets/ferumbras.png',64,64); //imagem grande e com 36 frames
    
    
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

var spriteSelecionado;

//função para criar sprites de maneira mais rápida
function summon (linhaTabuleiro,colTabuleiro,nome){ 
    posX = linhaTabuleiro*32+31;
    posY = colTabuleiro*32+31;
    
    //insere na posicao do tabuleiro levando em conta a numeração do tabuleiro
	var sprite = game.add.sprite(posX,posY,nome);
    sprite.linha = linhaTabuleiro;
    sprite.col = colTabuleiro;
    
    //criando resposta ao clique
    sprite.inputEnabled = true;
    sprite.hitArea = new Phaser.Rectangle(-32,-32,32,32); 
    sprite.events.onInputDown.add(criaMovimentacao,this);
    
    game.physics.arcade.enable(sprite);
    
    //muda a âncora para o canto inferior direito
    sprite.anchor.set(1,1); 
    
    //cria animações para o sprite.
    addAnimations(sprite);  
    
    //adiciona o sprite ao grupo de unidades
    unidades.add(sprite);
    
    
    //Ordena a ordem de rederização dos sprites
    unidades.sort('x');
    unidades.sort('y');
        
}






function move (sprite){
    console.log("moveu");
    //desabilita o input pro usuario não fazer m*rda
    game.input.enabled = false;
    
    //elimina quadrados antigos
    movimentacao.callAll('kill');
    
    //move o objeto
    game.physics.arcade.moveToObject(spriteSelecionado,sprite,60,600);
    
    //função para para o sprite quando ele chega ao destino
    game.time.events.add(600, function () {
        
        //corrige erro de precisão ao movimentar (pergunta se nao entender)
        spriteSelecionado.x = Math.ceil(sprite.x/32)*32-1;
        spriteSelecionado.y = Math.ceil(sprite.y/32)*32-1;
        
        console.log(sprite.x,sprite.y);
        spriteSelecionado.body.velocity.x = 0;
        spriteSelecionado.body.velocity.y = 0;
        game.input.enabled = true;
    }, this);
   
}

/* REESCREVER
function walk(sprite,numCasas,dir){  
    switch (dir) {
        case 'up':
            sprite.animations.play('up');
            break;
        case 'right':
            sprite.animations.play('right');
            break;
        case 'down':
            sprite.animations.play('down');
            break;
        case 'left':
            break;
            
    }
    
}

*/
 
function encontraSprite (posX,posY){ //NÃO UTILIZADO NO MOMENTO
         
   
    var resultado = unidades.getAll('x',posX); //filtra pela posição X
    for (i=0;i<resultado.length;i++)            //faz a segundo busca, filtrando agora pela posição Y
        if (resultado[i].y == posY){
            resultado[i].selecionado  = true;
            return resultado[i];         
        }
}



function criaMovimentacao (sprite){
    spriteClicado = sprite;
    posX = sprite.x;
    posY = sprite.y;
    spriteSelecionado = sprite;
    movimentacao.callAll('kill'); //remove os quadrados antigos
    var quadrados =[];
    quadrados.push(game.add.sprite(posX,posY-32,'quadrado'));       //pra cima
    quadrados.push(game.add.sprite(posX+32,posY-32,'quadrado'));    //pra cima e pra direita
    quadrados.push(game.add.sprite(posX+32,posY,'quadrado'));       //pra direita
    quadrados.push(game.add.sprite(posX+32,posY+32,'quadrado'));    //pra baixo e pra direita
    quadrados.push(game.add.sprite(posX,posY+32,'quadrado'));       //pra baixo
    quadrados.push(game.add.sprite(posX-32,posY+32,'quadrado'));    //pra baixo e pra esquerda
    quadrados.push(game.add.sprite(posX-32,posY,'quadrado'));       //pra esquerda
    quadrados.push(game.add.sprite(posX-32,posY-32,'quadrado'));    //pra cima e pra esquerda
    
    
    //adiciona os quadrados de movimento ao grupo
    movimentacao.addMultiple(quadrados);            
 
    
    
    movimentacao.children.forEach(function(quadrado){   
        quadrado.anchor.setTo(1,1);                             //muda âncora dos quadrados azuis
        quadrado.inputEnabled = true;
       
        console.log(quadrado.x,quadrado.y);
    })
    movimentacao.visible = true;
    
    movimentacao.onChildInputDown.add(move,this);
}
