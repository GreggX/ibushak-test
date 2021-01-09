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
  const data = []
  let call

  try {
    for (var i = 0; i < 20; i++) {
      call = await getJSON(`https://api.mercadolibre.com/sites/MLM/search?category=MLM1055&sort=price_asc&offset=${i * 50}`)
      data.push(call.results)
    }
    const results = await Promise.all(data
      .reduce((acc, val) => acc.concat(val), [])
      .map(async item => {
        try {
          let usr = await getJSON(`https://api.mercadolibre.com/users/${item.seller.id}`)
          return ({
            sellerID: item.seller.id,
            sellerName: usr.nickname,
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
        } catch {
          return ({
            sellerID: item.seller.id,
            sellerName: 'Not Found',
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
        }
      }))

    res.json(results)
  } catch(e) {
    console.error(e.message)
    res.json('error')
  }
}

module.exports = {
  apiGetPhones
}