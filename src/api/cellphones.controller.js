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
  const promises = []
  const results = []

  try {
    for (var i = 0; i < 20; i++) {
      console.log('pushing data')
      data.push(await getJSON(`https://api.mercadolibre.com/sites/MLM/search?category=MLM1055&offset=${i * 50}`))
    }
    for (let i = 0; i < data.length; i++) {
      for (let e = 0; e < data[i].results.length; e++) {
        let usr = await getJSON(`https://api.mercadolibre.com/users/${data[i].results[e].seller.id}`)
        results.push({
          sellerID: data[i].results[e].seller.id,
          sellerName: usr.nickname,
          producto: data[i].results[e].title,
          marca: data[i].results[e].title.split(" ")[0],
          precio: data[i].results[e].price,
          envioGratis: data[i].results[e].shipping.free_shipping,
          tipoLogistica: data[i].results[e].shipping.logistic_type,
          lugarOperacionSeller: {
            ciudad: data[i].results[e].seller_address.city.name,
            estado: data[i].results[e].seller_address.state.name,
            pais: data[i].results[e].seller_address.country.name
          },
          condicionArticulo: data[i].results[e].condition,
          rangoPrecios: data[i].results[e].prices
        })
      }
    }

    results.sort((a, b) => {
      return a.precio - b.precio
    })

    res.json(results)
  } catch(e) {
    console.error(e.message)
    res.json('error')
  }
}

module.exports = {
  apiGetPhones
}