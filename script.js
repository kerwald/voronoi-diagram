const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function( ) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

let pontos = [];
let mediatriz = [];

canvas.addEventListener('click', function(event) {
    
    const pontoClicado = { x: event.clientX, y: event.clientY };

    pontos.push( { x : pontoClicado.x, y : pontoClicado.y } );

    if( pontos.length >= 2 ){
        mediatriz.push( CalcularMediatriz( pontos[ pontos.length-2 ], pontos[ pontos.length -1 ] ) ); // y = mx + b
    }

});



function converterParaCSV( logDeEventos ) {

    // Cria o cabeçalho
    const cabecalho = [ 'timestamp', 'tipo', 'x', 'y', 'objetoId' ];
    
    // Mapeia cada objeto de log para uma linha de CSV
    const linhas = logDeEventos.map( evento => 
        cabecalho.map( coluna => evento[coluna]).join(',')
    );

    // Junta o cabeçalho com as linhas
    return [ cabecalho.join(','), ...linhas ].join('\n');

}

function exportarLogEmCSV( log, nomeDoArquivo ) {

    if ( log.length === 0 ) {
        alert('Nenhum dado para exportar!');
        return;
    }

    const conteudoCSV = converterParaCSV( log );
    const blob = new Blob( [conteudoCSV], { type: 'text/csv;charset=utf-8;' } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( 'a' );
    
    a.href = url;
    a.download = nomeDoArquivo;
    document.body.appendChild( a );
    a.click();
    document.body.removeChild( a );
    URL.revokeObjectURL( url );

}

// No seu botão de exportar
document.getElementById('exportar-btn').addEventListener('click', function() {
    exportarLogEmCSV( logDeEventos, 'log_de_execucao.csv' );
});


/*
==========================================================
Draw

Responsável por desenha os pontos e o diagrama de voronoi
==========================================================
*/

function Draw() {


    if ( pontos.length > 0 ) {

        mediatriz.forEach( mediatriz => {

            desenharMediatriz( ctx, canvas, mediatriz );

        });

        // desenha os pontos (vértices) da forma em construção
        pontos.forEach( pontos => {

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pontos.x, pontos.y, 5, 0, Math.PI * 2);
            ctx.fill();

        });
    }
}


/*
==========================================================
Animate

Mantém a animação em loop, limpando a tela e redesenhando os elementos com o uso do requestAnimationFrame.
==========================================================
*/
function Animate(){

    ctx.clearRect(0, 0, canvas.width, canvas.height );

    ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
  
    Draw();

    requestAnimationFrame( Animate );
    
}

Animate();

// calcula a reta mediatriz entre dois pontos
function CalcularMediatriz( pontoA, pontoB ){ // y = mx + b

    let mediatriz = {};
    let coefAngularAB;
    let m; // coeficiente angular da mediatriz

    const pontoMedio = {
        x : ( ( pontoA.x + pontoB.x ) / 2 ),
        y : ( ( pontoA.y + pontoB.y ) / 2 )
    }; 

    if( pontoA.x == pontoB.x ){ // caso em que a reta é vertical "divisao por zero"

        mediatriz = {  
            m : 0,  // m -> coefAngularAB, b -> pontoMedio.y
            b : pontoMedio.y,
            isVertical : false
        };

    } else if( pontoA.y == pontoB.y ){ // caso em que a reta é horizontal
        
        mediatriz = {
            xIntercept: pontoMedio.x,
            isVertical: true
        };

    }else{ // retas inclinadas

        coefAngularAB = ( pontoA.y - pontoB.y ) / ( pontoA.x - pontoB.x );
        m = ( coefAngularAB ** -1 ) * -1;

        mediatriz = {
            m : m,
            yIntercept : pontoMedio.y - ( m * pontoMedio.x ) // b = y - mx.
        };
    }

    return mediatriz;

}


function desenharMediatriz( ctx, canvas, mediatriz ){

    ctx.beginPath();
    ctx.strokeStyle = 'red'; 
    ctx.lineWidth = 1;

    if( mediatriz.isVertical === true ) {  // reta é vertical

        ctx.moveTo(mediatriz.xIntercept, 0);
        ctx.lineTo(mediatriz.xIntercept, canvas.height);

    } else if (mediatriz.m === 0) { // reta é horizontal
        // y = mx + b
        // A coordenada Y é constante (igual a 'b'). A linha vai da esquerda à direita.
        ctx.moveTo(0, mediatriz.b);
        ctx.lineTo(canvas.width, mediatriz.b);
        
    } else { // reta é inclinada
        // y = mx + b

        // Ponto de partida: vamos começar da borda esquerda (x=0)
        let yNaBordaAEsquerda = mediatriz.yIntercept; // Quando x=0, y=b

        // Ponto de chegada: vamos terminar na borda direita (x=canvas.width)
        let yNaBordaADireita = mediatriz.m * canvas.width + mediatriz.yIntercept;

        ctx.moveTo(0, yNaBordaAEsquerda);
        ctx.lineTo(canvas.width, yNaBordaADireita );
    }

    ctx.stroke(); // Efetivamente desenha a linha

}

function gerarCorAleatoria() {

  const letras = '0123456789ABCDEF';
  let cor = '#';

  for ( let i = 0; i < 6; i++ ) {

    cor += letras[ Math.floor( Math.random() * 16 ) ];

  }

  return cor;

}
