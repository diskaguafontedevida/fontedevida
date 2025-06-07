const CACHE_NAME = 'fonte-vida-cache-v1'; // Mude 'v1' se fizer atualizações significativas no seu app
const urlsToCache = [
  '/', // A raiz do seu aplicativo
  '/index.html',
  // Adicione aqui qualquer arquivo CSS que seu projeto utilize, por exemplo:
  // '/styles.css',
  // Adicione aqui qualquer arquivo JavaScript que seu projeto utilize, por exemplo:
  // '/scripts.js',
  '/goticula.png', // Sua imagem de ícone
  '/manifest.json'
  // Adicione ABSOLUTAMENTE TODOS os outros arquivos que seu aplicativo precisa para funcionar offline
  // Ex: outras imagens, fontes, outros arquivos HTML, JS, CSS, etc.
  // Cada arquivo deve ter seu caminho correto, começando com '/' se estiver na raiz do projeto.
];

self.addEventListener('install', event => {
  // O Service Worker está sendo instalado, vamos cachear os arquivos
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto:', CACHE_NAME);
        // Adicione todos os arquivos necessários ao cache
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Falha ao cachear URLs:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // Intercepta todas as requisições de rede
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna ele
        if (response) {
          return response;
        }
        // Caso contrário, tenta buscar da rede
        return fetch(event.request)
          .then(response => {
            // Se a busca for bem-sucedida e a resposta for válida, cacheia e retorna
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clona a resposta para o cache, pois a resposta original é um stream
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(error => {
            console.log('Falha na requisição de rede:', error);
            // Aqui você pode adicionar uma página offline fallback, se tiver
            // return caches.match('/offline.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  // Este evento é disparado quando o Service Worker é ativado
  // Remove caches antigos para liberar espaço e garantir que a versão mais recente seja usada
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});