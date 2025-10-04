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
let poligono = [];

canvas.addEventListener('click', function(event) {
    
    const pontoClicado = { x: event.clientX, y: event.clientY };

    pontos.push( { x : pontoClicado.x, y : pontoClicado.y } );


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
        // desenha os pontos (vértices) da forma em construção
        pontos.forEach( pontos => {

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pontos.x, pontos.y, 5, 0, Math.PI * 2);
            ctx.fill();

        });

        // Define uma caixa delimitadora muito maior que o canvas para garantir que os polígonos sejam fechados.
        const bounds = [-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2];

        for( let i=0; i<pontos.length; i++ ){
            for( let j=0; j<pontos.length; j++ ){

                if( i == j ){
                    continue;
                }

                let unidadePoligono = [ 
                    { x: bounds[0], y: bounds[1] },
                    { x: bounds[2], y: bounds[1] },
                    { x: bounds[2], y: bounds[3] },
                    { x: bounds[0], y: bounds[3] }
                ];

                poligonos[i] = calcularPoligono( unidadePoligono, i, j );

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

// Verifica se `testPoint` está mais perto de `p1` do que de `p2`.
function menorDistancia( testPoint, p1, p2 ){
    const d1_sq = (testPoint.x - p1.x) ** 2 + (testPoint.y - p1.y) ** 2;
    const d2_sq = (testPoint.x - p2.x) ** 2 + (testPoint.y - p2.y) ** 2;
    return d1_sq <= d2_sq; // 1 se perto de p1, 0 se perto de p2
}


// Calcula a interseção entre o segmento de reta (p1, p2) e a mediatriz de (site1, site2).
function getIntersection(p1, p2, site1, site2) {
    // Linha 1 (segmento p1-p2): A1x + B1y = C1
    const A1 = p2.y - p1.y;
    const B1 = p1.x - p2.x;
    const C1 = A1 * p1.x + B1 * p1.y;

    // Linha 2 (mediatriz de site1-site2)
    const A2 = 2 * (site2.x - site1.x);
    const B2 = 2 * (site2.y - site1.y);
    const C2 = site2.x ** 2 - site1.x ** 2 + site2.y ** 2 - site1.y ** 2;

    // Resolve o sistema de equações lineares para encontrar o ponto de interseção
    const det = A1 * B2 - A2 * B1;
    // Evita divisão por zero se as linhas forem paralelas
    if ( Math.abs(det) < 1e-9 ) { 
        return { x: p1.x, y: p1.y }; // Retorna um ponto caso não haja interseção clara
    }

    const x = ( B2 * C1 - B1 * C2 ) / det;
    const y = ( A1 * C2 - A2 * C1 ) / det;

    return { x, y };
}
