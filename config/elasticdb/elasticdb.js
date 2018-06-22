const fs = require('fs');
const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
  
const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];
  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });
  
    bulkBody.push(item);
  });
  
  esClient.bulk({body: bulkBody})
  .then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`${data.length - errorCount} itens indexados com sucesso de ${data.length} itens`);
  })
 .catch(console.err);
};
  
const carga = function carga() {
  const articlesRaw = fs.readFileSync('data.json');
  const articles = JSON.parse(articlesRaw);
  console.log(`${articles.length} itens parseados do arquivo de dados.`);
  bulkIndex('library', 'article', articles);
};

module.exports = carga;