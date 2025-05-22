
# MQTT com React - um projeto PET elétrica UFPR


MQTTREACT

O projeto serve como um guia incial para a utilização do REACT no VITE, dedicado a um projeto do PET para feira de profissões.

Também serve como um guia para membros do PET elétrica da UFPR para ajudar na criação e documentação de um site que será utilizado na feira de profissões da UFPR.

O site em questão tem o objetivo de por meio do mqtt react acender e apagar uma lâmpada pelo aperto de um botão. 
## Funcionamento MQTT

O MQTT é um protocolo de comunicação simples e eficiente, muito usado em dispositivos conectados (como sensores e sistemas IoT). Ele funciona como um "correio inteligente" para troca de mensagens entre dispositivos.

Funcionamneto básico:

Broker (Servidor Central): É o coração do sistema, responsável por receber e distribuir as mensagens.

Dispositivos: Alguns enviam dados (como sensores), e outros recebem (como aplicações ou outros dispositivos).

Tópicos (Canais): As mensagens são organizadas por temas. Por exemplo, um sensor de temperatura publica em casa/cozinha/temperatura, e quem estiver "inscrito" nesse canal recebe as atualizações.

Garantia de Entrega: Você pode escolher entre três níveis de QoS (Quality of Service):

QoS 0 (no máximo uma vez): Mensagem é enviada sem confirmação (pode perder mensagens).

QoS 1 (pelo menos uma vez): Garante o recebimento, mas pode repetir.

QoS 2 (exatamente uma vez): Assegura que a mensagem chegue exatamente uma vez.

## MQTT no código

https://github.com/PET-UFPR-Eletrica/mqttreact/blob/main/src/App.jsx

(Código em questão) 


No código deste projeto em específico o mqtt funciona na seguinte forma: 

- Primeiramente seleciona um topico de um brooker(caso a conexão fosse particular seria necessário um usuário e senha porém nesse caso o brooker é público portanto essa parte não é necessária)

- Em seguida o "client" se conecta ao brooker selecionado em caso de falha ele retorna em caso da conexão bem sucedida ele da contonuidade.

- Então, imediatamente após a conexão a lâmpada muda de estado, e conforme recebe a mensagem on ligando ela e off desligando ela(neste caso a mensagem é enviada por meio de apertar o botão do site )

## Contém

- plugins do setup incial
- o código do site da feira
- imagens da identidade visual do pet
- instruções de como começar 


## Instalação

Este modelo fornece uma configuração mínima para fazer o React funcionar no Vite com HMR e algumas regras do ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

@vitejs/plugin-react usa Babel para Fast Refresh

@vitejs/plugin-react-swc usa SWC para Fast Refresh

Expandindo a configuração do ESLint
Se você está desenvolvendo uma aplicação para produção, recomendamos usar TypeScript com regras de linting com reconhecimento de tipos ativadas. Confira o modelo TS para informações sobre como integrar TypeScript e typescript-eslint em seu projeto.

Para enviar para o GitHub como site:
https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3
## Códigos importantes

https://github.com/PET-UFPR-Eletrica/mqttreact/blob/main/package.json

https://github.com/PET-UFPR-Eletrica/mqttreact/blob/main/vite.config.js

https://github.com/PET-UFPR-Eletrica/mqttreact/blob/main/eslint.config.js

https://github.com/PET-UFPR-Eletrica/mqttreact/blob/main/package-lock.json

## Autores

- [@mpbast0s](https://www.github.com/mpbast0s)

