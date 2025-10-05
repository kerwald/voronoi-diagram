const canvas = document.getElementById( 'canvas' );
const ctx = canvas.getContext( '2d' );
const performanceLogDiv = document.getElementById( 'performance-log' );

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener( 'resize', function (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Draw();
});

let pontos = [];
let performanceData = [];

function Draw(){
    ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    if( pontos.length === 0 ){
        return;
    }

    let resolucao = 4;

    for( let y = 0; y < canvas.height; y += resolucao ){

        for( let x = 0; x < canvas.width; x += resolucao ){

            let menorDistancia = Infinity;
            let indiceDoPonto = -1;

            for( let i = 0; i < pontos.length; i++ ){

                const d = distanciaAoQuadrado( x, y, pontos[i].x, pontos[i].y );

                if( d < menorDistancia ){

                    menorDistancia = d;
                    indiceDoPonto = i;

                }
            }

            if( indiceDoPonto !== -1 ){

                ctx.fillStyle = pontos[indiceDoPonto].color;
                ctx.fillRect( x, y, resolucao, resolucao );

            }
        }
    }

    pontos.forEach( ponto => {

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc( ponto.x, ponto.y, 5, 0, Math.PI * 2 );
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

    } );
}

canvas.addEventListener( 'click', function ( event ){

    const pontoClicado = { x: event.clientX, y: event.clientY, color: gerarCorAleatoria() };
    pontos.push( pontoClicado );

    const startTime = performance.now();
    Draw();
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    performanceData.push( { numPontos: pontos.length, tempoMs: timeTaken } );
    console.log( `Cálculo com ${pontos.length} pontos levou ${timeTaken.toFixed( 2 )} ms.` );

} );

function gerarCorAleatoria(){

    const letras = '0123456789ABCDEF';
    let cor = '#';

    for( let i = 0; i < 6; i++ ){

        cor += letras[Math.floor( Math.random() * 16 )];

    }

    return cor;
}

function distanciaAoQuadrado( x1, y1, x2, y2 ){

    return ( ( x2 - x1 ) * ( x2 - x1 ) + ( y2 - y1 ) * ( y2 - y1 ) );

}

document.getElementById( 'export-btn' ).addEventListener( 'click', function (){

    exportarLogEmCSV( performanceData, 'performance_voronoi_pixel.csv' );

} );

function exportarLogEmCSV( log, nomeDoArquivo ){

    if( log.length === 0 ){

        alert( 'Nenhum dado de performance para exportar! Adicione alguns pontos primeiro.' );
        return;

    }

    const cabecalho = ['numPontos', 'tempoMs'];
    const linhas = log.map( dado => [dado.numPontos, dado.tempoMs.toFixed( 4 )].join( ',' ) );
    const conteudoCSV = [cabecalho.join( ',' ), ...linhas].join( '\n' );
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

Draw();