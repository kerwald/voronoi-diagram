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

    const pontoClicado = { x: event.clientX, y: event.clientY, color: gerarCorAleatoria() };
    pontos.push(pontoClicado);

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

    let d=0;
    let resolucao = 4;

    for( let y=0; y< canvas.height; y+=resolucao ){
        for( let x=0; x < canvas.width; x+= resolucao ){

            let menorDistancia = Infinity;
            let indiceDoPonto = 0;
            for( let i=0; i< pontos.length; i++ ){

                d = distanciaAoQuadrado( x, y, pontos[i].x, pontos[i].y );
                if( d < menorDistancia ){
                    menorDistancia = d;
                    indiceDoPonto = i;
                }

            }

            let color = pontos[indiceDoPonto].color;
            ctx.fillStyle = color;
            ctx.fillRect( x, y, resolucao, resolucao );

        // desenha os pontos (vértices) da forma em construção
        pontos.forEach( pontos => {

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pontos.x, pontos.y, 5, 0, Math.PI * 2);
            ctx.fill();

        });
       

        }
    }
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

function gerarCorAleatoria() {

  const letras = '0123456789ABCDEF';
  let cor = '#';

  for ( let i = 0; i < 6; i++ ) {

    cor += letras[ Math.floor( Math.random() * 16 ) ];

  }

  return cor;

}

function distanciaAoQuadrado( x1, y1, x2, y2 ) {
  return ((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}