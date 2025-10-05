const canvas = document.getElementById( 'canvas' );
const ctx = canvas.getContext( '2d' );
const performanceLogDiv = document.getElementById( 'performance-log' );

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener( 'resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let pontos = [];
let celulas = [];
let performanceData = [];

canvas.addEventListener( 'click', function( event ) {
    const pontoClicado = { x: event.clientX, y: event.clientY };
    pontos.push({ x: pontoClicado.x, y: pontoClicado.y, cor: gerarCorAleatoria() });

    // medição de desempenho
    const startTime = performance.now();

    celulas = [];
    
    // Define uma caixa delimitadora grande para garantir que os polígonos sejam fechados.
    const bounds = [-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2];

    for( let i = 0; i < pontos.length; i++ ){
        let unidadePoligono = [
            { x: bounds[0], y: bounds[1] }, 
            { x: bounds[2], y: bounds[1] },
            { x: bounds[2], y: bounds[3] }, 
            { x: bounds[0], y: bounds[3] }
        ];

        let celula = {
            poligono: unidadePoligono,
            ponto: pontos[i],
            cor: null,
            vizinhos: []
        };

        // Recorta o polígono da célula com base em todos os outros pontos
        for( let j = 0; j < pontos.length; j++ ){

            if( i === j ){
                continue;
            } 

            celula = calcularPoligono( celula, pontos[i], pontos[j] );
        }

        celula.cor = pontos[i].cor;
        celulas.push(celula);
    }

    // Encontra os vizinhos para desenhar a Triangulação de Delaunay
    for( let i = 0; i < celulas.length; i++ ){
        encontrarVizinhos( celulas[i], celulas );
    }
    
    // --- Fim da Medição de Desempenho ---
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    // Salva e exibe os dados de desempenho
    performanceData.push( { numPontos: pontos.length, tempoMs: timeTaken } );
    console.log( `Cálculo com ${pontos.length} pontos levou ${timeTaken.toFixed(2)} ms.` );
});

// Função para exportar os dados de performance para um arquivo CSV
function exportarLogEmCSV( log, nomeDoArquivo ) {
    if ( log.length === 0 ) {
        alert( 'Nenhum dado de performance para exportar! Adicione alguns pontos primeiro.' );
        return;
    }
    
    const cabecalho = [ 'numPontos', 'tempoMs' ];
    const linhas = log.map( dado => [ dado.numPontos, dado.tempoMs.toFixed(4) ].join(',') );
    const conteudoCSV = [ cabecalho.join(','), ...linhas].join('\n' );

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

document.getElementById( 'export-btn' ).addEventListener( 'click', function() {
    exportarLogEmCSV( performanceData, 'performance_voronoi.csv' );
});


/*
==========================================================
 FUNÇÕES DE DESENHO
==========================================================
*/
function Draw() {
    // Desenha o diagrama de Voronoi
    celulas.forEach( celula => {

        if( celula.poligono.length > 2 ){

            ctx.beginPath();
            ctx.moveTo( celula.poligono[0].x, celula.poligono[0].y );

            for( let j = 1; j < celula.poligono.length; j++ ){

                ctx.lineTo( celula.poligono[j].x, celula.poligono[j].y );

            }

            ctx.closePath();
            ctx.fillStyle = celula.cor;
            ctx.fill();
            ctx.strokeStyle = '#374151'; // Borda cinza escuro
            ctx.lineWidth = 2;
            ctx.stroke();

        }

    });

    // Desenha a Triangulação de Delaunay (gráfico dual)
    celulas.forEach(c => {

        // Para evitar desenhar arestas duplicadas, só desenhamos se o 'hash' do ponto atual for menor
        c.vizinhos.forEach( vizinho => {

            if( c.ponto.x + c.ponto.y < vizinho.ponto.x + vizinho.ponto.y ){

                 ctx.beginPath();
                 ctx.moveTo(c.ponto.x, c.ponto.y);
                 ctx.lineTo(vizinho.ponto.x, vizinho.ponto.y);
                 ctx.strokeStyle = '#FFFFFF'; // Branco
                 ctx.lineWidth = 1;
                 ctx.stroke();

            }

        });

    });

    // Desenha os pontos 
    pontos.forEach( ponto => {

        ctx.fillStyle = '#ff7700'; // Laranja
        ctx.beginPath();
        ctx.arc( ponto.x, ponto.y, 5, 0, Math.PI * 2 );
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF'; // Borda branca
        ctx.lineWidth = 2;
        ctx.stroke();

    });

}

function Animate() {

    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = "#111827"; // Fundo cinza escuro
    ctx.fillRect( 0, 0, canvas.width, canvas.height) ;
    Draw();
    requestAnimationFrame( Animate );

}

Animate();

/*
==========================================================
 LÓGICA DO ALGORITMO DE VORONOI
==========================================================
*/

function gerarCorAleatoria() {

    const letras = '0123456789ABCDEF';
    let cor = '#';
    for( let i = 0; i < 6; i++ ){

        cor += letras[Math.floor( Math.random() * 16 )];

    }

    return cor;

}

// Verifica se `testPoint` está mais perto de `p1` do que de `p2`.
function menorDistancia( testPoint, p1, p2 ){

    const d1_sq = ( testPoint.x - p1.x ) ** 2 + ( testPoint.y - p1.y ) ** 2;
    const d2_sq = ( testPoint.x - p2.x ) ** 2 + ( testPoint.y - p2.y ) ** 2;
    return d1_sq <= d2_sq;

}

// Calcula a interseção entre o segmento de reta (p1, p2) e a mediatriz de (site1, site2).
function getIntersection( p1, p2, site1, site2 ) {

    const A1 = p2.y - p1.y;
    const B1 = p1.x - p2.x;
    const C1 = A1 * p1.x + B1 * p1.y;

    const A2 = 2 * ( site2.x - site1.x );
    const B2 = 2 * ( site2.y - site1.y );
    const C2 = site2.x ** 2 - site1.x ** 2 + site2.y ** 2 - site1.y ** 2;

    const det = A1 * B2 - A2 * B1;
    if( Math.abs(det) < 1e-9 ){
        return null; // Linhas paralelas
    } 

    const x = (B2 * C1 - B1 * C2) / det;
    const y = (A1 * C2 - A2 * C1) / det;
    return { x, y };

}

// Recorta um polígono (da célula) contra o semi-plano definido pela mediatriz de pontoBase e otherPonto
function calcularPoligono(celula, pontoBase, otherPonto) {
    
    let poligonoNovo = [];
    const poligonoOriginal = celula.poligono;

    for( let i = 0; i < poligonoOriginal.length; i++ ) {

        const p1 = poligonoOriginal[i];
        const p2 = poligonoOriginal[ ( i + 1 ) % poligonoOriginal.length ];

        const p1EstaPerto = menorDistancia( p1, pontoBase, otherPonto );
        const p2EstaPerto = menorDistancia( p2, pontoBase, otherPonto );

        if( p1EstaPerto ){

            poligonoNovo.push( p1 );

        }

        // Se a aresta (p1, p2) cruza a mediatriz
        if( p1EstaPerto !== p2EstaPerto ){

            const intersection = getIntersection( p1, p2, pontoBase, otherPonto );

            if( intersection ){

                poligonoNovo.push( intersection );

            }
        }
    }
    
    // Retorna a célula atualizada com o novo polígono recortado
    celula.poligono = poligonoNovo;
    return celula;

}

/*
==========================================================
 LÓGICA DA TRIANGULAÇÃO DE DELAUNAY (VIZINHOS)
==========================================================
*/

// Verifica se duas células são vizinhas (compartilham uma aresta)
function temArestaComum( celulaA, celulaB ) {

    const poligonoA = celulaA.poligono;
    const poligonoB = celulaB.poligono;
    
    for( let i = 0; i < poligonoA.length; i++ ){

        const pA1 = poligonoA[i];
        const pA2 = poligonoA[ ( i + 1 ) % poligonoA.length ];
        
        for( let j = 0; j < poligonoB.length; j++ ){

            const pB1 = poligonoB[j];
            const pB2 = poligonoB[ ( j + 1 ) % poligonoB.length ];
            
            // Verifica se a aresta de A é a mesma que a aresta de B (em qualquer direção)
            if( saoArestasIguais( pA1, pA2, pB1, pB2 ) || saoArestasIguais( pA1, pA2, pB2, pB1 ) ){
                return true;
            }
        }
    }
    return false;
}

function saoArestasIguais( p1A, p2A, p1B, p2B ){
    return pontosIguais( p1A, p1B ) && pontosIguais( p2A, p2B );
}

function pontosIguais( pontoA, pontoB, tolerancia = 1e-6 ){
    return Math.abs( pontoA.x - pontoB.x ) < tolerancia && Math.abs( pontoA.y - pontoB.y ) < tolerancia;
}

function encontrarVizinhos( celulaAlvo, todasCelulas ) {
    celulaAlvo.vizinhos = []; // Limpa vizinhos antigos
    for( const outraCelula of todasCelulas ){
        if( celulaAlvo === outraCelula ) continue;
        
        if( temArestaComum( celulaAlvo, outraCelula ) ){
            celulaAlvo.vizinhos.push( outraCelula );
        }
    }
}