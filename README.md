# 📊 Análise Comparativa de Algoritmos para Diagrama de Voronoi
### Trabalho da Disciplina de Programação Avançada - Ciência da Computação, UFPel

Implementação e análise de desempenho de dois algoritmos para a geração de Diagramas de Voronoi: um incremental (geométrico) e um de força bruta (pixel-based).

---

### 🎥 Vídeos Demonstrativos

Nesses vídeos, demonstro o funcionamento de cada algoritmo implementado na aplicação web.

| Algoritmo Incremental (Geométrico) | Algoritmo de Força Bruta (Pixel-based) |
| :---: | :---: |
| [Assistir Vídeo](videos-demonstrativos/Diagrama-de-Voronoi-Incremental-e-Triangulacao-de-Deulanay.mp4) | [Assistir Vídeo](videos-demonstrativos/Diagrama-de-Voronoi-Forca-Bruta.mp4) |

---

### 📝 Descrição do Projeto

Este projeto implementa e compara o desempenho de dois algoritmos distintos para a geração de Diagramas de Voronoi:

1.  **Algoritmo Incremental (Geométrico, uma abordagem de recorte de polígonos que calcula as bordas exatas de cada célula.
2.  **Algoritmo de Força Bruta (Pixel-based, uma abordagem que determina a célula mais próxima para cada pixel na tela.

A aplicação web (`/app`) permite a coleta de dados de desempenho, que são analisados em um Notebook do Google Colab (`/analise`) para comparar o impacto do número de pontos e de sua distribuição no tempo de execução.

---

### 🛠️ Tecnologias Utilizadas

#### Frontend e Coleta de Dados
-   HTML5
-   JavaScript 
-   Canvas 

#### Análise de Dados e Visualização
-   Google Colab (Ambiente de Notebook)
-   Python 3
-   Pandas (para manipulação de dados)
-   Matplotlib e Seaborn (para geração de gráficos)

---

### 📈 Resultados e Análise

Os resultados completos, incluindo os gráficos de desempenho e as conclusões, podem ser encontrados no notebook `analise/analise_Desempenho_e_Graficos.ipynb`.

#### Simulação Manual do Funcionamento

Para ilustrar o processo lógico do algoritmo incremental, foi feita uma simulação manual passo a passo. A imagem abaixo demonstra como o polígono de uma célula é progressivamente recortado pelas mediatrizes dos pontos vizinhos.

![Simulação do Algoritmo Incremental](graficos-e-anotacoes/anotacao-demonstracao-de-funcionamento.pdf)

#### Comparativo Geral de Desempenho

![Gráfico Comparativo Geral](graficos-e-anotacoes/grafico-de-desempenho.png)

---
### 🚀 Como Executar

#### Parte 1: Aplicação Web para Coleta de Dados

A aplicação não requer um servidor web e pode ser executada localmente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/kerwald/voronoi-diagram
    ```
2.  **Abra o arquivo:**
    Navegue até a pasta `app/` e abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, etc.).
3.  **Utilize a aplicação:**
    -   Adicione pontos clicando na tela ou usando os botões.
    -   Exporte os arquivos de dados `.csv` para a análise.

#### Parte 2: Análise dos Dados no Colab

1.  **Acesse o Google Colab:**
    Vá para [colab.research.google.com](https://colab.research.google.com).
2.  **Carregue o Notebook:**
    Clique em `File > Upload notebook...` e selecione o arquivo `analise/analise_Desempenho_e_Graficos.ipynb` do repositório.
3.  **Execute as células:**
    -   Execute a célula que pede o upload dos arquivos.
    -   Envie os arquivos `.csv` que você gerou na aplicação web.
    -   Execute as células restantes para visualizar os gráficos e a análise completa.

---

### 👨‍💻 Autor

**FELIPE LEONARDO KERWALD SANTANA**

-   **Email:** [flksantana@inf.ufpel.edu.br]
-   **GitHub:** [@seu-usuario-github](https://github.com/kerwald)
-   **LinkedIn:** [/in/seu-perfil-linkedin](https://www.linkedin.com/in/felipekerwald/])

---
