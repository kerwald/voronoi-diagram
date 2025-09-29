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

canvas.addEventListener('click', function(event) {
    
    const pontoClicado = { x: event.clientX, y: event.clientY };
    let ponto;
    ponto.x = x;
    ponto.y = y;
    pontos.push( ponto );

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
function CalcularMediatriz( pontoA, pontoB ){

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

