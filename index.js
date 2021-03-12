
const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const fs = require('fs');
const Ytdl = require('ytdl-core');
const { OpusEncoder } = require('@discordjs/opus');
const encoder = new OpusEncoder(48000, 2);
const prism = require('prism-media');
const prefixoComando = '!';
const filaMusicas = [];
let musica = [];

const {TOKEN_DISCORD,GOOGLE_KEY} = require('./config.js');
let connection ;

const youtube = new Youtube(GOOGLE_KEY)
const app = new Discord.Client();
let estouPronto = false;

app.on('ready', () => {
      console.log('Estou conectado!');
});




app.on('message', async (msg) => {
      
      
      
      

      // !entrar = Bot se junta ao canal de voz
      if (msg.content === `${prefixoComando}entrar`){
            if (msg.member.voice.channel){ 

                  
                  connection = await msg.member.voice.channel.join();

                  estouPronto = true;
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      // !leave = Bot sai do canal de voz
       if (msg.content === `${prefixoComando}sair`){
            if (msg.member.voice.channel){ 
                 if(connection.dispatcher){
                  connection.dispatcher.end();
                  msg.member.voice.channel.leave();
                  estouPronto = false;
                 }else{
                  msg.member.voice.channel.leave();
                  estouPronto = false;
                 }
                  
                  
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      // !play [link] = Bot toca músicas
       if (msg.content.startsWith(`${prefixoComando}tocar `)){
            if (estouPronto){
                  let oQueTocar = msg.content.replace(`${prefixoComando}tocar `, '');
                  try{
                        let video = await youtube.getVideo(oQueTocar);
                        msg.channel.send(`Musica Encontrada: ${video.title} - Desenvolvido por Marcos Dias`);
                        filaMusicas.push(oQueTocar)
                        if(filaMusicas.length === 1) {
                              tocarMusica(msg)
                              musica = video.title
                        }
                      }catch(error){
                              try{
                              let videoPesquisados = await youtube.searchVideos(oQueTocar, 5);
                              let videoEncontrado;
                              if(videoPesquisados != 0){
                              for (i in videoPesquisados){
                                    videoEncontrado = await youtube.getVideoByID(videoPesquisados[i].id);
                                    msg.channel.send(`${i}: ${videoEncontrado.title}`);
                              }
                              msg.channel.send({embed: {
                                    color: 3447003,
                                    description: 'Escolha uma Música de 0 a 4!, Clicando nas reações!, Você tem apenas 30seg , Desenvolvido por Marcos Dias - DEV'
                              }}).then( async (embedMessage) => {
                                    await embedMessage.react('0️⃣');
                                    await embedMessage.react('1️⃣');
                                    await embedMessage.react('2️⃣');
                                    await embedMessage.react('3️⃣');
                                    await embedMessage.react('4️⃣');

                                    const filter =  (reaction, user) => {
                                          return ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣'].includes(reaction.emoji.name)
                                                && user.id === msg.author.id;
                                    }

                                    let collector = embedMessage.createReactionCollector(filter, {time: 40000})
                                    collector.on('collect', async (reaction,reactionCollector) => {
                                          if(reaction.emoji.name === '0️⃣'){
                                                msg.channel.send('Reagiu com 0️⃣');
                                                videoEncontrado = await youtube.getVideoByID(videoPesquisados[0].id);
                                                filaMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`);
                                                if(filaMusicas.length >= 1) {
                                                      msg.channel.send(` Musica ${videoEncontrado.title} Adicionada a fila - Desenvolvido por Marcos Dias`);
                                                      
                                                }
                                          }else if(reaction.emoji.name === '1️⃣'){
                                                msg.channel.send('Reagiu com 1️⃣');
                                                videoEncontrado = await youtube.getVideoByID(videoPesquisados[1].id);
                                                filaMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`)
                                                if(filaMusicas.length >= 1) {
                                                      msg.channel.send(` Musica ${videoEncontrado.title} Adicionada a fila - Desenvolvido por Marcos Dias`);
                                                      
                                                }
                                          }else if(reaction.emoji.name === '2️⃣'){
                                                msg.channel.send('Reagiu com 2️⃣');
                                                videoEncontrado = await youtube.getVideoByID(videoPesquisados[2].id);
                                                filaMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`)
                                                if(filaMusicas.length >= 1) {
                                                      msg.channel.send(` Musica ${videoEncontrado.title} Adicionada a fila - Desenvolvido por Marcos Dias`);
                                                      
                                                }
                                          }else if(reaction.emoji.name === '3️⃣'){
                                                msg.channel.send('Reagiu com 3️⃣');
                                                videoEncontrado = await youtube.getVideoByID(videoPesquisados[3].id);
                                                filaMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`)
                                                if(filaMusicas.length >= 1) {
                                                      msg.channel.send(` Musica ${videoEncontrado.title} Adicionada a fila - Desenvolvido por Marcos Dias`);
                                                      
                                                }
                                          }else if(reaction.emoji.name === '4️⃣'){
                                                msg.channel.send('Reagiu com 4️⃣');
                                                videoEncontrado = await youtube.getVideoByID(videoPesquisados[4].id);
                                                filaMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`)
                                                if(filaMusicas.length >= 1) {
                                                      msg.channel.send(` Musica ${videoEncontrado.title} Adicionada a fila - Desenvolvido por Marcos Dias`);
                                                      
                                                }
                                          }


                                          if(filaMusicas.length === 1) {
                                                tocarMusica(msg) 
                                          }
                                    });
                              })
                              }else{
                                    msg.channel.send('Nenhum video/Musica encontrada - Desenvolvido por Marcos Dias');
                              }
                            }catch(error){
                                    
                               msg.channel.send('Nenhum video/Musica encontrada - Desenvolvido por Marcos Dias');
                            }
                      }
                  
            }

      }


      //pause

      if (msg.content === `${prefixoComando}pausar`){
            if (msg.member.voice.channel){ 
                   if(connection.dispatcher){
                       
                        if(!connection.dispatcher.paused){
                              connection.dispatcher.pause();
                        }else {
                              msg.channel.send('Eu ja estou pausado');
                        }
                   }else{
                        msg.channel.send('Nao estou tocando nada...')
                   }
                          
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      //resume

      if (msg.content === `${prefixoComando}voltar`){
            if (msg.member.voice.channel){ 
                   if(connection.dispatcher){
                       
                        if(connection.dispatcher.paused){
                              connection.dispatcher.resume();
                        }else {
                              msg.channel.send('Eu não estou pausado');
                        }
                   }else{
                        msg.channel.send('Nao estou tocando nada...')
                   }
                          
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      //parar

      if (msg.content === `${prefixoComando}parar`){
            if (msg.member.voice.channel){ 
                  if(connection.dispatcher){
                        connection.dispatcher.end();
                        while(filaMusicas.length > 0)
                              filaMusicas.shift();
                  } else {
                        msg.channel.send('Nao estou tocando nada')
                  }
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      // prox

      if (msg.content === `${prefixoComando}prox`){
            if (msg.member.voice.channel){ 
                  if(connection.dispatcher){
                        if(filaMusicas.length > 1){
                        connection.dispatcher.end();
                        }else{
                              msg.channel.send('Nao Existem mais musicas Para serem Tocadas')
                        }
                  } else {
                        msg.channel.send('Nao estou tocando nada');
                  }
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }

      //lista (em breve)

      if (msg.content === `${prefixoComando}lista`){
            if (msg.member.voice.channel){ 
                  if(connection.dispatcher){
                        msg.channel.send('PROXIMAS MUSICAS');
                        for (i in filaMusicas){
                        msg.channel.send(`${filaMusicas[i]}`)
                        }
                  } else {
                        msg.channel.send('Nao estou tocando nada');
                  }
            } else {
                  msg.channel.send('Você precisa estar conectado a um Canal de Voz!');
            }
      }
     

});


function tocarMusica(msg){
      connection.play(Ytdl(filaMusicas[0])).on('finish', () => {
             filaMusicas.shift();
             if(filaMusicas.length >= 1){
                   tocarMusica(msg);
             }
      });
 }


 app.on('debug', console.log)


app.login(TOKEN_DISCORD);