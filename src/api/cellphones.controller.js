const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)

    request.onload = function() {
      try {
        if (this.status === 200) {
          resolve(JSON.parse(this.responseText))
        } else {
          reject(this.status + ' ' + this.statusText)
        }
      } catch(e) {
        reject(e.message)
      }
    }

    request.onerror = function() {
      reject(this.status + ' ' + this.statusText)
    }

    request.send()
  })
}

async function apiGetPhones(req, res) {
  const baseUrl = 'https://api.mercadolibre.com/sites/MLM/search?'
  const queryParams = {
    category: 'MLM1055',
    offset: 0
  }
  const data = []
  const results = []

  try {
    for (var i = 0; i < 2; i++) {
      data.push(await getJSON(baseUrl + 'category=' + queryParams.category + '&offset=' + i * 50))
    }
  } catch(e) {
    console.error(e)
  }

  data.forEach((e, i) => {
    e.results.forEach(item => {
      results.push({
        sellerID: item.seller.id,
        producto: item.title,
        marca: item.title.split(" ")[0],
        precio: item.price,
        envioGratis: item.shipping.free_shipping,
        tipoLogistica: item.shipping.logistic_type,
        lugarOperacionSeller: {
          ciudad: item.seller_address.city.name,
          estado: item.seller_address.state.name,
          pais: item.seller_address.country.name
        },
        condicionArticulo: item.condition,
        rangoPrecios: item.prices
      })
    })
  })

  results.sort((a, b) => {
    return a.precio - b.precio
  })
  res.json(results)
}

module.exports = {
  apiGetPhones
}