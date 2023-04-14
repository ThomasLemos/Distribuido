# Distribuido
React é uma biblioteca JavaScript para construir interfaces de usuário.  
Flask é um framework web Python para a construção de aplicações web. 

Ao criar um aplicativo da Web com React e Flask, os dois são usados juntos em uma arquitetura cliente-servidor. 
O React é executado no navegador do usuário e é responsável por renderizar a interface do usuário e lidar com as interações do usuário. 
O Flask é executado no servidor e é responsável por processar solicitações, manipular lógica de negócios e interagir com bancos de dados ou outros serviços.

Como React e Flask interagem:

O usuário interage com a interface do usuário do React clicando em botões ou preenchendo formulários.
No meu caso eu utilizo botões para que o usuario grave audio ou modifique .
Quando o usuário executa uma ação que requer dados do servidor, o React envia uma solicitação HTTP para a API Flask.
A API do Flask recebe a solicitação e a processa de acordo com a lógica de negócios definida no código do lado do servidor. 
Depois que a Flask API processa a solicitação, ela retorna uma resposta ao React. Essa resposta indica se a solicitação foi bem-sucedida ou não.
O React recebe a resposta da API do Flask e atualiza a interface do usuário de acordo.
No geral, o React e o Flask trabalham juntos para criar um aplicativo da Web dinâmico que pode responder às interações do usuário em tempo real.
